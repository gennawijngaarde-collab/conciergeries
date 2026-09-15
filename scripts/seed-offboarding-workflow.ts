/**
 * Seed Production Offboarding Workflow
 * 
 * Run this script to add the production-quality offboarding workflow
 * to your database.
 * 
 * Usage:
 *   npx tsx scripts/seed-offboarding-workflow.ts
 */

import { createClient } from '@supabase/supabase-js';
import { createProductionOffboardingWorkflow } from '../src/core/domain/workflows/production-offboarding';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedWorkflow(tenantId: string) {
  console.log('🌱 Seeding production offboarding workflow...');
  
  // Create workflow definition
  const workflow = createProductionOffboardingWorkflow(tenantId, 'system');
  
  // Check if workflow already exists
  const { data: existing } = await supabase
    .from('workflows')
    .select('id')
    .eq('id', workflow.id)
    .single();
  
  if (existing) {
    console.log('⚠️  Workflow already exists, updating...');
    
    // Update existing workflow
    const { error } = await supabase
      .from('workflows')
      .update({
        name: workflow.name,
        description: workflow.description,
        type: workflow.type,
        definition: workflow.steps,
        enabled: workflow.enabled,
        version: workflow.version,
        updated_at: new Date().toISOString(),
      })
      .eq('id', workflow.id);
    
    if (error) {
      console.error('❌ Failed to update workflow:', error);
      process.exit(1);
    }
    
    console.log('✅ Workflow updated successfully');
  } else {
    // Insert new workflow
    const { error } = await supabase
      .from('workflows')
      .insert({
        id: workflow.id,
        tenant_id: workflow.tenantId,
        name: workflow.name,
        description: workflow.description,
        type: workflow.type,
        definition: workflow.steps,
        enabled: workflow.enabled,
        version: workflow.version,
        created_by: workflow.metadata.createdBy,
        created_at: workflow.metadata.createdAt.toISOString(),
        updated_at: workflow.metadata.updatedAt.toISOString(),
      });
    
    if (error) {
      console.error('❌ Failed to insert workflow:', error);
      process.exit(1);
    }
    
    console.log('✅ Workflow created successfully');
  }
  
  // Print workflow details
  console.log('\n📋 Workflow Details:');
  console.log('  ID:', workflow.id);
  console.log('  Name:', workflow.name);
  console.log('  Type:', workflow.type);
  console.log('  Tenant ID:', workflow.tenantId);
  console.log('  Steps:', workflow.steps.length);
  console.log('  Enabled:', workflow.enabled);
  
  console.log('\n📝 Workflow Steps:');
  workflow.steps.forEach((step, index) => {
    console.log(`  ${index + 1}. ${step.name}`);
    console.log(`     Type: ${step.type}`);
    console.log(`     Actions: ${step.actions.length}`);
    if (step.dependsOn) {
      console.log(`     Depends on: ${step.dependsOn.join(', ')}`);
    }
  });
  
  console.log('\n✅ Seeding complete!');
}

// Get tenant ID from command line or use default
const tenantId = process.argv[2] || 'default_tenant';

console.log('🎯 Target tenant:', tenantId);
console.log('');

seedWorkflow(tenantId)
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
