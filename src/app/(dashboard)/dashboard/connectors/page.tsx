'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ExternalLink,
  Plus,
  Settings,
  Activity,
  Globe,
  MapPin
} from "lucide-react";

// Mock data - dans la vraie application, ceci viendrait de l'API
const configuredConnectors = [
  {
    id: 'conn_001',
    systemName: 'lucca',
    displayName: 'Lucca',
    region: '🇫🇷 France',
    status: 'healthy' as const,
    lastSync: '2024-01-15T14:30:00Z',
    employeeCount: 250,
    latency: 145,
    configured: true,
  },
  {
    id: 'conn_002',
    systemName: 'microsoft-entra',
    displayName: 'Microsoft Entra ID',
    region: '🌍 Global',
    status: 'healthy' as const,
    lastSync: '2024-01-15T14:35:00Z',
    employeeCount: 250,
    latency: 89,
    configured: true,
  },
  {
    id: 'conn_003',
    systemName: 'microsoft-365',
    displayName: 'Microsoft 365',
    region: '🌍 Global',
    status: 'healthy' as const,
    lastSync: '2024-01-15T14:35:00Z',
    employeeCount: 250,
    latency: 92,
    configured: true,
  },
];

const availableConnectors = [
  {
    systemName: 'cegid',
    displayName: 'Cegid (Talentsoft)',
    description: 'Suite RH complète pour le recrutement, la performance et la formation',
    type: 'HRIS',
    region: '🇫🇷 France',
    authType: 'OAuth 2.0',
    documentationUrl: 'https://developers.cegid.com/',
    configured: false,
  },
  {
    systemName: 'silae',
    displayName: 'Silae',
    description: 'Logiciel de paie et gestion RH français',
    type: 'HRIS',
    region: '🇫🇷 France',
    authType: 'API Key',
    documentationUrl: 'https://www.silae.fr/documentation-api',
    configured: false,
  },
  {
    systemName: 'sage',
    displayName: 'Sage HR',
    description: 'Solution RH et paie complète',
    type: 'HRIS',
    region: '🌍 Global',
    authType: 'OAuth 2.0',
    documentationUrl: 'https://developers.sage.com/',
    configured: false,
  },
];

export default function ConnectorsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Connecteurs</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos connexions HRIS et systèmes d'actions
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connecteurs actifs</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              +1 ce mois-ci
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employés synchronisés</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">250</div>
            <p className="text-xs text-muted-foreground">
              Dernière sync: il y a 5 min
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latence moyenne</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">109ms</div>
            <p className="text-xs text-green-600">
              ↓ 12% ce mois-ci
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Santé globale</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">
              Tous les systèmes opérationnels
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Configured Connectors */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Connecteurs configurés</h2>
        </div>

        <div className="grid gap-4">
          {configuredConnectors.map((connector) => (
            <Card key={connector.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{connector.displayName}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {connector.region}
                      </Badge>
                      {connector.status === 'healthy' && (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Opérationnel
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      {connector.employeeCount} employés synchronisés · Latence: {connector.latency}ms
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Configurer
                    </Button>
                    <Button variant="outline" size="sm">
                      <Activity className="h-4 w-4 mr-1" />
                      Health Check
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div>
                      Dernière synchronisation: {new Date(connector.lastSync).toLocaleString('fr-FR')}
                    </div>
                  </div>
                  <Button variant="link" size="sm">
                    Voir les logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Available Connectors - French HRIS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Connecteurs HRIS français disponibles</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Connectez votre SIRH français en quelques clics
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {availableConnectors.map((connector) => (
            <Card key={connector.systemName} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">{connector.displayName}</CardTitle>
                    <CardDescription className="text-xs">
                      {connector.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <Badge variant="outline">{connector.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Région</span>
                    <span className="font-medium">{connector.region}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Authentification</span>
                    <span className="font-medium">{connector.authType}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-1" />
                    Connecter {connector.displayName}
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={connector.documentationUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Documentation
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            Configuration sécurisée
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            ✅ Toutes les credentials sont chiffrées au repos (AES-256-GCM)
          </p>
          <p>
            ✅ Les webhooks sont validés par signature HMAC
          </p>
          <p>
            ✅ Principe du moindre privilège appliqué
          </p>
          <p className="pt-2">
            📖 <a href="/docs/connectors" className="text-blue-600 hover:underline">
              Consultez notre guide de configuration détaillé
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
