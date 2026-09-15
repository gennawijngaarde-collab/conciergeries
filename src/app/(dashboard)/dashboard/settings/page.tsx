/**
 * Settings Page
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Tenant configuration and preferences
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tenant Settings</CardTitle>
            <CardDescription>
              Configure your HR SyncGuard instance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <p>Settings UI coming soon...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
