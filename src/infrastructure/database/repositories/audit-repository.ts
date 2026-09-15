/**
 * Audit Repository
 * Data access layer for audit logs
 */

import { supabase } from '../supabase-client';

export interface AuditLog {
  id?: string;
  tenantId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  userId?: string;
  systemActor?: string;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: Date;
}

export class AuditRepository {
  /**
   * Create an audit log entry
   */
  async create(log: AuditLog): Promise<AuditLog> {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert({
        tenant_id: log.tenantId,
        action: log.action,
        resource_type: log.resourceType,
        resource_id: log.resourceId,
        user_id: log.userId,
        system_actor: log.systemActor,
        changes: log.changes,
        metadata: log.metadata,
        ip_address: log.ipAddress,
        user_agent: log.userAgent,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Failed to create audit log:', error);
      // Don't throw - audit logging should never break the application
      return log;
    }
    
    return {
      ...log,
      id: data.id,
      createdAt: new Date(data.created_at),
    };
  }
  
  /**
   * Get audit logs for a resource
   */
  async findByResource(resourceType: string, resourceId: string, tenantId: string, limit: number = 100): Promise<AuditLog[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('resource_type', resourceType)
      .eq('resource_id', resourceId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Failed to fetch audit logs:', error);
      return [];
    }
    
    return data.map(row => this.mapToAuditLog(row));
  }
  
  /**
   * Get recent audit logs for a tenant
   */
  async findRecent(tenantId: string, limit: number = 100): Promise<AuditLog[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Failed to fetch recent audit logs:', error);
      return [];
    }
    
    return data.map(row => this.mapToAuditLog(row));
  }
  
  private mapToAuditLog(row: any): AuditLog {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      action: row.action,
      resourceType: row.resource_type,
      resourceId: row.resource_id,
      userId: row.user_id,
      systemActor: row.system_actor,
      changes: row.changes,
      metadata: row.metadata,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      createdAt: new Date(row.created_at),
    };
  }
}
