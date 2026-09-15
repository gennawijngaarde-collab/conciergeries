/**
 * Mock HRIS Webhook Endpoint
 * Receives webhooks from the mock HRIS system
 */

import { NextRequest, NextResponse } from 'next/server';
import { MockHRISConnector } from '@/connectors/hris/mock-hris/mock-hris-connector';
import { EventRepository } from '@/infrastructure/database/repositories/event-repository';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    console.log('Received webhook from Mock HRIS:', {
      eventType: payload.event_type,
      timestamp: new Date().toISOString(),
    });
    
    // Initialize connector (in real app, get config from database)
    const connector = new MockHRISConnector();
    await connector.configure({
      tenantId: payload.tenant_id || 'default_tenant',
      credentials: {
        encrypted: '',
        iv: '',
        authTag: '',
      },
      settings: {},
    });
    
    // Handle webhook
    const event = await connector.handleWebhook(payload);
    
    if (!event) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }
    
    // Save event to database
    const eventRepo = new EventRepository();
    await eventRepo.create(event);
    
    console.log('Event created:', {
      id: event.id,
      type: event.eventType,
    });
    
    // Trigger workflow execution for termination events
    if (event.eventType === 'employee.terminated') {
      console.log('🔄 Triggering offboarding workflow...');
      
      // Call workflow execution API (async, don't wait)
      fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/workflows/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          workflowType: 'offboarding',
          tenantId: event.tenantId,
        }),
      }).catch(error => {
        console.error('Failed to trigger workflow:', error);
      });
    }
    
    return NextResponse.json({
      success: true,
      eventId: event.id,
      message: 'Event received and queued for processing',
      workflowTriggered: event.eventType === 'employee.terminated',
    });
    
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process webhook',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    endpoint: 'mock-hris-webhook',
    timestamp: new Date().toISOString(),
  });
}
