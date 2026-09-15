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
    
    // In a real system, this would trigger workflow execution
    // For MVP, we'll add a background job processor
    
    return NextResponse.json({
      success: true,
      eventId: event.id,
      message: 'Event received and queued for processing',
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
