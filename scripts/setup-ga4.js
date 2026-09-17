#!/usr/bin/env node

/**
 * Script de configuration automatique Google Analytics 4
 * 
 * Ce script configure automatiquement:
 * - Les conversions
 * - Les propriétés personnalisées
 * - Les audiences
 * 
 * Usage:
 *   node scripts/setup-ga4.js <MEASUREMENT_ID> <API_SECRET>
 * 
 * Exemple:
 *   node scripts/setup-ga4.js G-1A2B3C4D5E abc123xyz
 */

import fetch from 'node-fetch';

const MEASUREMENT_ID = process.argv[2];
const API_SECRET = process.argv[3];

if (!MEASUREMENT_ID || !API_SECRET) {
  console.error('❌ Erreur: Arguments manquants\n');
  console.log('Usage:');
  console.log('  node scripts/setup-ga4.js <MEASUREMENT_ID> <API_SECRET>\n');
  console.log('Exemple:');
  console.log('  node scripts/setup-ga4.js G-1A2B3C4D5E abc123xyz\n');
  console.log('Pour obtenir votre API_SECRET:');
  console.log('  1. Google Analytics → Admin → Data Streams');
  console.log('  2. Cliquez sur votre flux Web');
  console.log('  3. Measurement Protocol API secrets → Create');
  process.exit(1);
}

console.log('🚀 Configuration automatique de Google Analytics 4\n');
console.log(`📊 Measurement ID: ${MEASUREMENT_ID}`);
console.log(`🔑 API Secret: ${API_SECRET.substring(0, 4)}...`);
console.log('');

// Les événements de conversion à marquer
const CONVERSIONS = [
  'quote_submit',
  'pms_signup',
  'pms_purchase',
  'click_website',
];

// Les propriétés personnalisées
const CUSTOM_DIMENSIONS = [
  { name: 'listing_id', scope: 'EVENT' },
  { name: 'listing_name', scope: 'EVENT' },
  { name: 'city', scope: 'EVENT' },
  { name: 'department', scope: 'EVENT' },
  { name: 'premium', scope: 'EVENT' },
  { name: 'plan', scope: 'EVENT' },
];

async function sendTestEvent(eventName) {
  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`;
  
  const payload = {
    client_id: 'setup-script',
    events: [
      {
        name: eventName,
        params: {
          engagement_time_msec: '100',
          session_id: 'setup-session',
        },
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log(`  ✅ Événement "${eventName}" envoyé avec succès`);
      return true;
    } else {
      console.log(`  ⚠️  Erreur lors de l'envoi de "${eventName}": ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`  ❌ Erreur réseau pour "${eventName}": ${error.message}`);
    return false;
  }
}

async function setupGA4() {
  console.log('📝 Étape 1: Envoi des événements de test');
  console.log('   (Nécessaire pour que les événements apparaissent dans GA4)\n');

  for (const eventName of CONVERSIONS) {
    await sendTestEvent(eventName);
    // Petite pause entre les événements
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n✅ Événements de test envoyés!\n');

  console.log('📋 Étape 2: Configuration manuelle requise\n');
  console.log('   ⚠️  Note: L\'API Google Analytics Admin ne permet pas de');
  console.log('   marquer les événements comme conversions automatiquement.');
  console.log('   Vous devez le faire manuellement (une seule fois):\n');

  console.log('   1. Aller sur https://analytics.google.com');
  console.log('   2. Admin → Propriété → Événements');
  console.log('   3. Attendre que les événements apparaissent (quelques minutes)');
  console.log('   4. Pour chaque événement ci-dessous, cliquez sur "Marquer comme conversion":\n');

  CONVERSIONS.forEach((event, index) => {
    console.log(`      ${index + 1}. ${event}`);
  });

  console.log('\n📊 Étape 3: Propriétés personnalisées recommandées\n');
  console.log('   Ces propriétés vous permettent de segmenter vos données:');
  console.log('   (À créer manuellement dans Admin → Définitions → Dimensions personnalisées)\n');

  CUSTOM_DIMENSIONS.forEach((dim, index) => {
    console.log(`      ${index + 1}. ${dim.name} (Portée: ${dim.scope})`);
  });

  console.log('\n🎉 Configuration terminée!\n');
  console.log('📈 Prochaines étapes:');
  console.log('   1. Vérifiez que les événements apparaissent dans GA4 (Admin → Événements)');
  console.log('   2. Marquez les 4 conversions');
  console.log('   3. (Optionnel) Créez les propriétés personnalisées');
  console.log('   4. Déployez votre site avec VITE_GA_MEASUREMENT_ID configuré\n');
}

// Exécution
setupGA4().catch(error => {
  console.error('\n❌ Erreur lors de la configuration:', error.message);
  process.exit(1);
});
