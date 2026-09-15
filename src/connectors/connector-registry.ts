/**
 * Connector Registry
 * 
 * Central registry for all HRIS and Action connectors.
 * Use this to instantiate the appropriate connector based on system type.
 */

import { HRISConnector } from './interfaces/hris-connector.interface';
import { ActionConnector } from './interfaces/action-connector.interface';
import { HRISSystem } from '@/core/domain/models/employee';

// HRIS Connectors
import { MockHRISConnector } from './hris/mock-hris/mock-hris-connector';
import { LuccaConnector } from './hris/lucca/lucca-connector';
import { CegidConnector } from './hris/cegid/cegid-connector';
import { SilaeConnector } from './hris/silae/silae-connector';
import { SageConnector } from './hris/sage/sage-connector';

// Action Connectors
import { EntraConnector } from './actions/microsoft-entra/entra-connector';
import { M365Connector } from './actions/microsoft-365/m365-connector';

export interface ConnectorInfo {
  systemName: string;
  displayName: string;
  description: string;
  type: 'hris' | 'action';
  region: 'global' | 'france' | 'europe' | 'us';
  requiredConfig: string[];
  optionalConfig?: string[];
  documentationUrl?: string;
  supportLevel: 'production' | 'beta' | 'mock';
}

/**
 * Registry of all available HRIS connectors
 */
export const HRIS_CONNECTOR_REGISTRY: Record<HRISSystem, ConnectorInfo> = {
  mock: {
    systemName: 'mock',
    displayName: 'Mock HRIS',
    description: 'Connecteur de test pour développement et démonstration',
    type: 'hris',
    region: 'global',
    requiredConfig: [],
    optionalConfig: [],
    supportLevel: 'mock',
  },
  lucca: {
    systemName: 'lucca',
    displayName: 'Lucca',
    description: 'SIRH français pour la gestion RH, congés et notes de frais',
    type: 'hris',
    region: 'france',
    requiredConfig: ['domain', 'apiToken'],
    optionalConfig: ['webhookSecret'],
    documentationUrl: 'https://developers.lucca.fr/',
    supportLevel: 'production',
  },
  cegid: {
    systemName: 'cegid',
    displayName: 'Cegid (Talentsoft)',
    description: 'Suite RH complète pour le recrutement, la performance et la formation',
    type: 'hris',
    region: 'france',
    requiredConfig: ['instanceUrl', 'clientId', 'clientSecret', 'tenantCode'],
    optionalConfig: ['webhookSecret'],
    documentationUrl: 'https://developers.cegid.com/',
    supportLevel: 'production',
  },
  silae: {
    systemName: 'silae',
    displayName: 'Silae',
    description: 'Logiciel de paie et gestion RH français',
    type: 'hris',
    region: 'france',
    requiredConfig: ['apiKey', 'dossierCode'],
    optionalConfig: ['apiUrl', 'webhookSecret'],
    documentationUrl: 'https://www.silae.fr/documentation-api',
    supportLevel: 'production',
  },
  sage: {
    systemName: 'sage',
    displayName: 'Sage HR',
    description: 'Solution RH et paie complète (anciennement Sage Business Cloud People)',
    type: 'hris',
    region: 'global',
    requiredConfig: ['clientId', 'clientSecret', 'companyId'],
    optionalConfig: ['apiUrl', 'webhookSecret'],
    documentationUrl: 'https://developers.sage.com/',
    supportLevel: 'production',
  },
  sap: {
    systemName: 'sap',
    displayName: 'SAP SuccessFactors',
    description: 'Suite RH d\'entreprise SAP',
    type: 'hris',
    region: 'global',
    requiredConfig: ['apiUrl', 'companyId', 'username', 'password'],
    optionalConfig: ['webhookSecret'],
    documentationUrl: 'https://help.sap.com/docs/SAP_SUCCESSFACTORS_PLATFORM',
    supportLevel: 'beta',
  },
  workday: {
    systemName: 'workday',
    displayName: 'Workday',
    description: 'Plateforme RH cloud d\'entreprise',
    type: 'hris',
    region: 'global',
    requiredConfig: ['tenantName', 'username', 'password'],
    optionalConfig: ['webhookSecret'],
    documentationUrl: 'https://community.workday.com/sites/default/files/file-hosting/productionapi/index.html',
    supportLevel: 'beta',
  },
  personio: {
    systemName: 'personio',
    displayName: 'Personio',
    description: 'SIRH pour PME européennes',
    type: 'hris',
    region: 'europe',
    requiredConfig: ['clientId', 'clientSecret'],
    optionalConfig: ['webhookSecret'],
    documentationUrl: 'https://developer.personio.de/',
    supportLevel: 'beta',
  },
  bamboohr: {
    systemName: 'bamboohr',
    displayName: 'BambooHR',
    description: 'SIRH pour PME',
    type: 'hris',
    region: 'us',
    requiredConfig: ['subdomain', 'apiKey'],
    optionalConfig: ['webhookSecret'],
    documentationUrl: 'https://documentation.bamboohr.com/',
    supportLevel: 'beta',
  },
};

/**
 * Create an HRIS connector instance
 */
export function createHRISConnector(systemName: HRISSystem): HRISConnector {
  switch (systemName) {
    case 'mock':
      return new MockHRISConnector();
    case 'lucca':
      return new LuccaConnector();
    case 'cegid':
      return new CegidConnector();
    case 'silae':
      return new SilaeConnector();
    case 'sage':
      return new SageConnector();
    default:
      throw new Error(`HRIS connector not implemented: ${systemName}`);
  }
}

/**
 * Registry of all available action connectors
 */
export const ACTION_CONNECTOR_REGISTRY: Record<string, ConnectorInfo> = {
  'microsoft-entra': {
    systemName: 'microsoft-entra',
    displayName: 'Microsoft Entra ID',
    description: 'Gestion des identités et accès Microsoft (anciennement Azure AD)',
    type: 'action',
    region: 'global',
    requiredConfig: ['tenantId', 'clientId', 'clientSecret'],
    optionalConfig: [],
    documentationUrl: 'https://learn.microsoft.com/en-us/graph/api/overview',
    supportLevel: 'production',
  },
  'microsoft-365': {
    systemName: 'microsoft-365',
    displayName: 'Microsoft 365',
    description: 'Gestion des licences et services Microsoft 365',
    type: 'action',
    region: 'global',
    requiredConfig: ['tenantId', 'clientId', 'clientSecret'],
    optionalConfig: [],
    documentationUrl: 'https://learn.microsoft.com/en-us/graph/api/overview',
    supportLevel: 'production',
  },
};

/**
 * Create an action connector instance
 */
export function createActionConnector(systemName: string): ActionConnector {
  switch (systemName) {
    case 'microsoft-entra':
      return new EntraConnector();
    case 'microsoft-365':
      return new M365Connector();
    default:
      throw new Error(`Action connector not implemented: ${systemName}`);
  }
}

/**
 * Get all connectors for a specific region
 */
export function getConnectorsByRegion(region: string): ConnectorInfo[] {
  return Object.values(HRIS_CONNECTOR_REGISTRY).filter(
    connector => connector.region === region || connector.region === 'global'
  );
}

/**
 * Get French HRIS connectors
 */
export function getFrenchConnectors(): ConnectorInfo[] {
  return getConnectorsByRegion('france');
}

/**
 * Get production-ready connectors only
 */
export function getProductionConnectors(): ConnectorInfo[] {
  return Object.values(HRIS_CONNECTOR_REGISTRY).filter(
    connector => connector.supportLevel === 'production'
  );
}
