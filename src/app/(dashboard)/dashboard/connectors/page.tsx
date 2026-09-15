/**
 * Connectors Page
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ConnectorsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Connectors</h1>
          <p className="text-muted-foreground mt-1">
            Manage HRIS and action system integrations
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connected Systems</CardTitle>
            <CardDescription>
              HRIS systems and action platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <p>Connector management UI coming soon...</p>
              <p className="text-sm mt-2">
                Connectors are configured via code
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
