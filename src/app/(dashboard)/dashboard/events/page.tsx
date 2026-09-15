/**
 * Events Page
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground mt-1">
            Incoming HR events from connected systems
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>
              Events from HRIS systems awaiting processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <p>Event log viewer coming soon...</p>
              <p className="text-sm mt-2">
                Events are being processed in the background
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
