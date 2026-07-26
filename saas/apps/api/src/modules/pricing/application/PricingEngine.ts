/**
 * Pure pricing engine — no I/O. Fully unit-testable.
 * Applies nightly base, weekend uplift, season/event overlays,
 * min/max clamps, stay constraints, discounts and promotions.
 */

export interface PricingContext {
  date: Date;
  /** Day of week 0=Sun … 6=Sat (optional; derived from date if omitted) */
  dayOfWeek?: number;
  nights?: number;
  baseNightly: number;
  /** Season name currently active, if any */
  season?: string;
  /** Event name currently active, if any */
  event?: string;
  /** Promo / coupon code */
  promoCode?: string;
}

export interface SeasonRate {
  name: string;
  /** Absolute nightly override, or multiplier if `mode === 'multiplier'` */
  value: number;
  mode?: 'absolute' | 'multiplier';
}

export interface EventRate {
  name: string;
  value: number;
  mode?: 'absolute' | 'multiplier';
}

export interface DiscountRule {
  /** Percent 0–100 or fixed amount when mode is 'fixed' */
  value: number;
  mode?: 'percent' | 'fixed';
}

export interface PromotionRule {
  code: string;
  value: number;
  mode?: 'percent' | 'fixed';
  minNights?: number;
}

export interface StayConstraints {
  minStay?: number;
  maxStay?: number;
}

export interface PriceBounds {
  min?: number;
  max?: number;
}

export interface PricingResult {
  nightly: number;
  total: number;
  nights: number;
  applied: string[];
  stayValid: boolean;
  stayErrors: string[];
}

export class PricingEngine {
  applyNightly(base: number): number {
    return Math.max(0, round2(base));
  }

  applyWeekend(base: number, dayOfWeek: number, weekendMultiplier = 1.2): number {
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
    return round2(isWeekend ? base * weekendMultiplier : base);
  }

  applySeason(base: number, season: string | undefined, seasons: SeasonRate[]): number {
    if (!season) return base;
    const rule = seasons.find((s) => s.name === season);
    if (!rule) return base;
    return rule.mode === 'multiplier'
      ? round2(base * rule.value)
      : round2(rule.value);
  }

  applyEvent(base: number, event: string | undefined, events: EventRate[]): number {
    if (!event) return base;
    const rule = events.find((e) => e.name === event);
    if (!rule) return base;
    return rule.mode === 'multiplier'
      ? round2(base * rule.value)
      : round2(rule.value);
  }

  applyMin(price: number, min?: number): number {
    if (min === undefined) return price;
    return round2(Math.max(price, min));
  }

  applyMax(price: number, max?: number): number {
    if (max === undefined) return price;
    return round2(Math.min(price, max));
  }

  applyMinStay(nights: number, minStay?: number): { valid: boolean; error?: string } {
    if (minStay === undefined || nights >= minStay) return { valid: true };
    return { valid: false, error: `Minimum stay is ${minStay} nights` };
  }

  applyMaxStay(nights: number, maxStay?: number): { valid: boolean; error?: string } {
    if (maxStay === undefined || nights <= maxStay) return { valid: true };
    return { valid: false, error: `Maximum stay is ${maxStay} nights` };
  }

  applyDiscount(price: number, discount?: DiscountRule): number {
    if (!discount) return price;
    if (discount.mode === 'fixed') return round2(Math.max(0, price - discount.value));
    return round2(Math.max(0, price * (1 - discount.value / 100)));
  }

  applyPromotion(
    price: number,
    promoCode: string | undefined,
    promotions: PromotionRule[],
    nights: number,
  ): { price: number; applied?: string } {
    if (!promoCode) return { price };
    const promo = promotions.find((p) => p.code.toLowerCase() === promoCode.toLowerCase());
    if (!promo) return { price };
    if (promo.minNights !== undefined && nights < promo.minNights) return { price };

    const next =
      promo.mode === 'fixed'
        ? Math.max(0, price - promo.value)
        : Math.max(0, price * (1 - promo.value / 100));

    return { price: round2(next), applied: promo.code };
  }

  /**
   * Full pipeline for one night (or multi-night total using same nightly).
   */
  quote(
    ctx: PricingContext,
    options: {
      weekendMultiplier?: number;
      seasons?: SeasonRate[];
      events?: EventRate[];
      bounds?: PriceBounds;
      stay?: StayConstraints;
      discount?: DiscountRule;
      promotions?: PromotionRule[];
    } = {},
  ): PricingResult {
    const applied: string[] = [];
    const nights = ctx.nights ?? 1;
    const dayOfWeek = ctx.dayOfWeek ?? ctx.date.getDay();

    let nightly = this.applyNightly(ctx.baseNightly);
    applied.push('nightly');

    const withWeekend = this.applyWeekend(
      nightly,
      dayOfWeek,
      options.weekendMultiplier ?? 1.2,
    );
    if (withWeekend !== nightly) applied.push('weekend');
    nightly = withWeekend;

    const withSeason = this.applySeason(nightly, ctx.season, options.seasons ?? []);
    if (withSeason !== nightly) applied.push(`season:${ctx.season}`);
    nightly = withSeason;

    const withEvent = this.applyEvent(nightly, ctx.event, options.events ?? []);
    if (withEvent !== nightly) applied.push(`event:${ctx.event}`);
    nightly = withEvent;

    nightly = this.applyMin(nightly, options.bounds?.min);
    if (options.bounds?.min !== undefined) applied.push('min');
    nightly = this.applyMax(nightly, options.bounds?.max);
    if (options.bounds?.max !== undefined) applied.push('max');

    const beforeDiscount = nightly;
    nightly = this.applyDiscount(nightly, options.discount);
    if (nightly !== beforeDiscount) applied.push('discount');

    const promo = this.applyPromotion(
      nightly,
      ctx.promoCode,
      options.promotions ?? [],
      nights,
    );
    nightly = promo.price;
    if (promo.applied) applied.push(`promotion:${promo.applied}`);

    const stayErrors: string[] = [];
    const minStay = this.applyMinStay(nights, options.stay?.minStay);
    if (!minStay.valid && minStay.error) stayErrors.push(minStay.error);
    const maxStay = this.applyMaxStay(nights, options.stay?.maxStay);
    if (!maxStay.valid && maxStay.error) stayErrors.push(maxStay.error);

    return {
      nightly,
      total: round2(nightly * nights),
      nights,
      applied,
      stayValid: stayErrors.length === 0,
      stayErrors,
    };
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
