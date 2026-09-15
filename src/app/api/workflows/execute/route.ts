/**
 * Workflow Execution API
 * Triggers workflow execution for an event
 */

import { NextRequest, NextResponse } from 'next/server';
import { WorkflowExecutionService } from '@/core/engine/workflow-engine/workflow-execution-service';
import { ActionExecutor } from '@/core/engine/action-engine/action-executor';
import { Verifier } from '@/core/engine/verification-engine/verifier';
import { WorkflowRepository } from '@/infrastructure/database/repositories/workflow-repository';
import { EventRepository } from '@/infrastructure/database/repositories/event-repository';
import { MicrosoftEntraConnector } from '@/connectors/actions/microsoft-entra/entra-connector';
import { Microsoft365Connector } from '@/connectors/actions/microsoft-365/m365-connector';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, workflowType, tenantId } = body;
    
    if (!eventId || !workflowType || !tenantId) {
      return NextResponse.json(
        { error: 'Missing required fields: eventId, workflowType, tenantId' },
        { status: 400 }
      );
    }
    
    console.log('🚀 Workflow execution requested:', {
      eventId,
      workflowType,
      tenantId,
    });
    
    // Initialize repositories
    const workflowRepo = new WorkflowRepository();
    const eventRepo = new EventRepository();
    
    // Get event
    const event = await eventRepo.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Get workflow
    const workflow = await workflowRepo.findByType(workflowType, tenantId);
    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }
    
    // Initialize action executor and register connectors
    const actionExecutor = new ActionExecutor();
    
    // Register Microsoft Entra connector
    const entraConnector = new MicrosoftEntraConnector();
    await entraConnector.configure({
      tenantId,
      credentials: { encrypted: '', iv: '', authTag: '' },
      settings: {},
    });
    actionExecutor.registerConnector(entraConnector);
    
    // Register Microsoft 365 connector
    const m365Connector = new Microsoft365Connector();
    await m365Connector.configure({
      tenantId,
      credentials: { encrypted: '', iv: '', authTag: '' },
      settings: {},
    });
    actionExecutor.registerConnector(m365Connector);
    
    // Initialize verifier
    const verifier = new Verifier();
    verifier.registerConnector(entraConnector);
    verifier.registerConnector(m365Connector);
    
    // Create workflow execution service
    const executionService = new WorkflowExecutionService(actionExecutor, verifier);
    
    // Execute workflow (async - don't wait)
    executionService.executeWorkflow(workflow, event, {
      triggeredBy: 'api',
      triggeredAt: new Date(),
    }).catch(error => {
      console.error('Workflow execution error:', error);
    });
    
    return NextResponse.json({
      success: true,
      message: 'Workflow execution started',
      workflowId: workflow.id,
      workflowName: workflow.name,
      eventId: event.id,
    });
    
  } catch (error: any) {
    console.error('API error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to start workflow execution',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// Get workflow execution status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const executionId = searchParams.get('executionId');
    
    if (!executionId) {
      return NextResponse.json(
        { error: 'Missing executionId parameter' },
        { status: 400 }
      );
    }
    
    const workflowRepo = new WorkflowRepository();
    const execution = await workflowRepo.findExecutionById(executionId);
    
    if (!execution) {
      return NextResponse.json(
        { error: 'Execution not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      execution,
    });
    
  } catch (error: any) {
    console.error('API error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch execution status',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
