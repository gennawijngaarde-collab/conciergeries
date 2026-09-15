/**
 * Workflows Page
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function WorkflowsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground mt-1">
            Configure and manage workflow definitions
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Workflow Definitions</CardTitle>
            <CardDescription>
              Onboarding, offboarding, and job change workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <p>Workflow configuration UI coming soon...</p>
              <p className="text-sm mt-2">
                Workflows are currently managed via database
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
