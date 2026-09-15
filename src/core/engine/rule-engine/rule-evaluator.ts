/**
 * Rule Evaluator
 * Evaluates rules to determine which workflow should execute for an event
 */

import { BaseEvent } from '@/core/domain/events/base-event';

export interface Rule {
  id: string;
  name: string;
  eventType: string;
  conditions: RuleCondition;
  priority: number;
  workflowId: string;
  enabled: boolean;
}

export interface RuleCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'exists' | 'not_exists' | 'in' | 'not_in';
  value?: any;
  and?: RuleCondition[];
  or?: RuleCondition[];
}

export class RuleEvaluator {
  /**
   * Evaluate all rules for an event and return matching workflows
   * Returns workflows sorted by priority (lower number = higher priority)
   */
  async evaluateRules(event: BaseEvent, rules: Rule[]): Promise<string[]> {
    // Filter rules by event type and enabled status
    const applicableRules = rules.filter(
      rule => rule.enabled && rule.eventType === event.eventType
    );
    
    // Evaluate conditions for each rule
    const matchingRules = applicableRules.filter(rule => 
      this.evaluateCondition(rule.conditions, event)
    );
    
    // Sort by priority (ascending)
    matchingRules.sort((a, b) => a.priority - b.priority);
    
    // Return workflow IDs
    return matchingRules.map(rule => rule.workflowId);
  }
  
  /**
   * Evaluate a single condition against event data
   */
  private evaluateCondition(condition: RuleCondition, event: BaseEvent): boolean {
    // Handle logical operators
    if (condition.and) {
      return condition.and.every(c => this.evaluateCondition(c, event));
    }
    
    if (condition.or) {
      return condition.or.some(c => this.evaluateCondition(c, event));
    }
    
    // Get field value from event using dot notation
    const fieldValue = this.getFieldValue(condition.field, event);
    
    // Evaluate operator
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
        
      case 'not_equals':
        return fieldValue !== condition.value;
        
      case 'contains':
        return typeof fieldValue === 'string' && 
               fieldValue.includes(String(condition.value));
        
      case 'not_contains':
        return typeof fieldValue === 'string' && 
               !fieldValue.includes(String(condition.value));
        
      case 'exists':
        return fieldValue !== undefined && fieldValue !== null;
        
      case 'not_exists':
        return fieldValue === undefined || fieldValue === null;
        
      case 'in':
        return Array.isArray(condition.value) && 
               condition.value.includes(fieldValue);
        
      case 'not_in':
        return Array.isArray(condition.value) && 
               !condition.value.includes(fieldValue);
        
      default:
        console.warn(`Unknown operator: ${condition.operator}`);
        return false;
    }
  }
  
  /**
   * Get field value from event using dot notation
   * Example: "employee.personalInfo.email" -> event.employee.personalInfo.email
   */
  private getFieldValue(field: string, event: any): any {
    const parts = field.split('.');
    let value = event;
    
    for (const part of parts) {
      if (value === undefined || value === null) {
        return undefined;
      }
      value = value[part];
    }
    
    return value;
  }
}
