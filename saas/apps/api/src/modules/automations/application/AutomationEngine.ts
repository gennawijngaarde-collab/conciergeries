/**
 * IF/THEN automation engine — pure TypeScript, no I/O.
 */

export type ConditionOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'contains'
  | 'exists';

export interface AutomationCondition {
  field: string;
  op: ConditionOperator;
  value?: unknown;
}

export type AutomationActionType =
  | 'set_field'
  | 'notify'
  | 'create_task'
  | 'send_message'
  | 'webhook'
  | 'adjust_price';

export interface AutomationAction {
  type: AutomationActionType;
  params?: Record<string, unknown>;
}

export interface AutomationRuleDefinition {
  id: string;
  name: string;
  enabled?: boolean;
  /** All conditions must match (AND). Empty = always true. */
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  priority?: number;
}

export interface AutomationEvaluationContext {
  /** Flat or nested payload; nested fields use dot notation e.g. booking.status */
  data: Record<string, unknown>;
}

export interface ActionPlan {
  ruleId: string;
  ruleName: string;
  actions: AutomationAction[];
}

export interface EvaluationResult {
  matched: ActionPlan[];
  skipped: { ruleId: string; reason: string }[];
}

export class AutomationEngine {
  evaluate(
    rules: AutomationRuleDefinition[],
    ctx: AutomationEvaluationContext,
  ): EvaluationResult {
    const sorted = [...rules].sort(
      (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
    );

    const matched: ActionPlan[] = [];
    const skipped: { ruleId: string; reason: string }[] = [];

    for (const rule of sorted) {
      if (rule.enabled === false) {
        skipped.push({ ruleId: rule.id, reason: 'disabled' });
        continue;
      }

      const ok = rule.conditions.every((c) => this.matchCondition(c, ctx.data));
      if (!ok) {
        skipped.push({ ruleId: rule.id, reason: 'conditions_not_met' });
        continue;
      }

      matched.push({
        ruleId: rule.id,
        ruleName: rule.name,
        actions: rule.actions,
      });
    }

    return { matched, skipped };
  }

  matchCondition(
    condition: AutomationCondition,
    data: Record<string, unknown>,
  ): boolean {
    const actual = getPath(data, condition.field);

    switch (condition.op) {
      case 'exists':
        return actual !== undefined && actual !== null;
      case 'eq':
        return actual === condition.value;
      case 'neq':
        return actual !== condition.value;
      case 'gt':
        return compare(actual, condition.value) > 0;
      case 'gte':
        return compare(actual, condition.value) >= 0;
      case 'lt':
        return compare(actual, condition.value) < 0;
      case 'lte':
        return compare(actual, condition.value) <= 0;
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(actual);
      case 'contains':
        if (typeof actual === 'string' && typeof condition.value === 'string') {
          return actual.includes(condition.value);
        }
        if (Array.isArray(actual)) {
          return actual.includes(condition.value);
        }
        return false;
      default:
        return false;
    }
  }

  /** Apply set_field actions onto a shallow copy of data (stub side-effect). */
  applyActions(
    data: Record<string, unknown>,
    plans: ActionPlan[],
  ): Record<string, unknown> {
    const next = structuredClone(data);
    for (const plan of plans) {
      for (const action of plan.actions) {
        if (action.type === 'set_field' && action.params?.field) {
          setPath(next, String(action.params.field), action.params.value);
        }
      }
    }
    return next;
  }
}

function getPath(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.');
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur === null || cur === undefined || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

function setPath(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split('.');
  let cur: Record<string, unknown> = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]!;
    const child = cur[key];
    if (child === null || child === undefined || typeof child !== 'object') {
      cur[key] = {};
    }
    cur = cur[key] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]!] = value;
}

function compare(a: unknown, b: unknown): number {
  const na = Number(a);
  const nb = Number(b);
  if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
  return String(a).localeCompare(String(b));
}
