import type { AutomationRule } from '../domain/AutomationRule.js';
import type { IAutomationRepository } from '../domain/IAutomationRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import {
  AutomationEngine,
  type AutomationRuleDefinition,
  type AutomationEvaluationContext,
  type EvaluationResult,
} from './AutomationEngine.js';

export class AutomationService {
  private readonly engine = new AutomationEngine();

  constructor(private readonly repo: IAutomationRepository) {}

  async list(organizationId: string): Promise<AutomationRule[]> {
    return this.repo.list(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<AutomationRule> {
    const item = await this.repo.findById(organizationId, id);
    if (!item) throw AppError.notFound('AutomationRule', id);
    return item;
  }

  async create(
    organizationId: string,
    data: Partial<AutomationRule>,
  ): Promise<AutomationRule> {
    return this.repo.create(organizationId, data);
  }

  async update(
    organizationId: string,
    id: string,
    data: Partial<AutomationRule>,
  ): Promise<AutomationRule> {
    await this.getById(organizationId, id);
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.getById(organizationId, id);
    await this.repo.delete(organizationId, id);
  }

  evaluate(
    rules: AutomationRuleDefinition[],
    ctx: AutomationEvaluationContext,
  ): EvaluationResult {
    return this.engine.evaluate(rules, ctx);
  }
}
