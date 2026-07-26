import { describe, it, expect } from 'vitest';
import { PricingEngine } from '../../src/modules/pricing/application/PricingEngine.js';

describe('PricingEngine', () => {
  const engine = new PricingEngine();

  it('applies nightly base', () => {
    expect(engine.applyNightly(100)).toBe(100);
    expect(engine.applyNightly(-5)).toBe(0);
  });

  it('applies weekend multiplier', () => {
    expect(engine.applyWeekend(100, 3, 1.25)).toBe(100); // Wed
    expect(engine.applyWeekend(100, 6, 1.25)).toBe(125); // Sat
  });

  it('applies season absolute and multiplier', () => {
    expect(
      engine.applySeason(100, 'summer', [{ name: 'summer', value: 150 }]),
    ).toBe(150);
    expect(
      engine.applySeason(100, 'summer', [
        { name: 'summer', value: 1.5, mode: 'multiplier' },
      ]),
    ).toBe(150);
  });

  it('applies event rates', () => {
    expect(
      engine.applyEvent(100, 'festival', [{ name: 'festival', value: 200 }]),
    ).toBe(200);
  });

  it('clamps min and max', () => {
    expect(engine.applyMin(80, 100)).toBe(100);
    expect(engine.applyMax(120, 100)).toBe(100);
  });

  it('validates minStay and maxStay', () => {
    expect(engine.applyMinStay(2, 3).valid).toBe(false);
    expect(engine.applyMaxStay(10, 7).valid).toBe(false);
    expect(engine.applyMinStay(3, 3).valid).toBe(true);
  });

  it('applies discount and promotion', () => {
    expect(engine.applyDiscount(100, { value: 10, mode: 'percent' })).toBe(90);
    expect(engine.applyDiscount(100, { value: 15, mode: 'fixed' })).toBe(85);

    const promo = engine.applyPromotion(
      100,
      'SAVE20',
      [{ code: 'SAVE20', value: 20, mode: 'percent' }],
      2,
    );
    expect(promo.price).toBe(80);
    expect(promo.applied).toBe('SAVE20');
  });

  it('quotes a full pipeline', () => {
    const result = engine.quote(
      {
        date: new Date('2026-07-18'), // Saturday
        baseNightly: 100,
        nights: 2,
        season: 'summer',
        promoCode: 'WELCOME',
      },
      {
        weekendMultiplier: 1.2,
        seasons: [{ name: 'summer', value: 1.1, mode: 'multiplier' }],
        bounds: { min: 50, max: 500 },
        stay: { minStay: 1, maxStay: 14 },
        promotions: [{ code: 'WELCOME', value: 10, mode: 'percent' }],
      },
    );

    expect(result.stayValid).toBe(true);
    expect(result.nights).toBe(2);
    expect(result.nightly).toBeGreaterThan(0);
    expect(result.total).toBe(result.nightly * 2);
    expect(result.applied.length).toBeGreaterThan(0);
  });
});
