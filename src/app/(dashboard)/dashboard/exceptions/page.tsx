/**
 * Exceptions List Page
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';

const mockExceptions = [
  {
    id: 'exc_001',
    title: 'SAP Access Revocation Failed',
    description: 'Failed to revoke SAP access for Thomas Leroy after 3 attempts',
    severity: 'high',
    status: 'open',
    employee: 'Thomas Leroy',
    workflow: 'Offboarding',
    system: 'SAP',
    createdAt: '2024-03-15T08:15:32Z',
  },
  {
    id: 'exc_002',
    title: 'License Assignment Timeout',
    description: 'Microsoft 365 license assignment timed out for Marie Dubois',
    severity: 'medium',
    status: 'acknowledged',
    employee: 'Marie Dubois',
    workflow: 'Onboarding',
    system: 'Microsoft 365',
    createdAt: '2024-03-15T07:22:15Z',
    assignedTo: 'admin@company.com',
  },
  {
    id: 'exc_003',
    title: 'Group Membership Sync Failed',
    description: 'Unable to add user to Engineering group in Google Workspace',
    severity: 'medium',
    status: 'open',
    employee: 'Pierre Martin',
    workflow: 'Job Change',
    system: 'Google Workspace',
    createdAt: '2024-03-15T06:45:00Z',
  },
  {
    id: 'exc_004',
    title: 'Webhook Verification Failed',
    description: 'Lucca webhook signature validation failed',
    severity: 'low',
    status: 'open',
    workflow: 'Event Processing',
    system: 'Lucca',
    createdAt: '2024-03-14T22:30:18Z',
  },
];

export default function ExceptionsPage() {
  const stats = {
    open: mockExceptions.filter((e) => e.status === 'open').length,
    acknowledged: mockExceptions.filter((e) => e.status === 'acknowledged').length,
    critical: mockExceptions.filter((e) => e.severity === 'critical').length,
    high: mockExceptions.filter((e) => e.severity === 'high').length,
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Exceptions</h1>
            <p className="text-muted-foreground mt-1">
              Workflow actions requiring manual intervention
            </p>
          </div>
          <Button variant="outline">
            <AlertCircle className="h-4 w-4 mr-2" />
            Configure Alerts
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Open</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.open}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Acknowledged</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.acknowledged}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>High Priority</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.high}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Critical</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.critical}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exceptions List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Exceptions</CardTitle>
            <CardDescription>
              Showing {mockExceptions.length} exceptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockExceptions.map((exception) => (
                <Link
                  key={exception.id}
                  href={`/dashboard/exceptions/${exception.id}`}
                  className="block"
                >
                  <div className="p-4 border rounded-lg hover:bg-accent transition-colors space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <AlertCircle
                          className={`h-5 w-5 mt-0.5 ${
                            exception.severity === 'critical'
                              ? 'text-purple-500'
                              : exception.severity === 'high'
                              ? 'text-red-500'
                              : exception.severity === 'medium'
                              ? 'text-orange-500'
                              : 'text-yellow-500'
                          }`}
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{exception.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {exception.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge
                          variant={
                            exception.severity === 'critical' || exception.severity === 'high'
                              ? 'destructive'
                              : exception.severity === 'medium'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {exception.severity}
                        </Badge>
                        <Badge
                          variant={
                            exception.status === 'open'
                              ? 'default'
                              : 'outline'
                          }
                        >
                          {exception.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-xs text-muted-foreground">
                      {exception.employee && (
                        <span>Employee: {exception.employee}</span>
                      )}
                      <span>Workflow: {exception.workflow}</span>
                      <span>System: {exception.system}</span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(exception.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {exception.assignedTo && (
                      <div className="text-xs text-muted-foreground">
                        Assigned to: {exception.assignedTo}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
