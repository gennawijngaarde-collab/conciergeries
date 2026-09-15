/**
 * Workflow Execution Detail Page
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Mock data - in production, this would come from API
const mockExecution = {
  id: 'wfex_004',
  employee: {
    name: 'Thomas Leroy',
    email: 'thomas.leroy@company.fr',
    department: 'Sales',
    terminationDate: '2024-03-15',
  },
  workflow: {
    name: 'Offboarding',
    type: 'offboarding',
    startedAt: '2024-03-15T08:00:00Z',
    completedAt: '2024-03-15T08:15:32Z',
  },
  status: 'failed',
  actions: [
    {
      id: 'act_001',
      name: 'HRIS',
      description: 'Termination received',
      status: 'completed',
      system: 'mock_hris',
      completedAt: '2024-03-15T08:00:05Z',
    },
    {
      id: 'act_002',
      name: 'Microsoft Entra',
      description: 'Account disabled',
      status: 'completed',
      system: 'microsoft_entra',
      verificationStatus: 'verified',
      completedAt: '2024-03-15T08:01:12Z',
    },
    {
      id: 'act_003',
      name: 'Microsoft 365',
      description: 'Sessions revoked',
      status: 'completed',
      system: 'microsoft_365',
      verificationStatus: 'verified',
      completedAt: '2024-03-15T08:02:45Z',
    },
    {
      id: 'act_004',
      name: 'CRM',
      description: 'Access revoked',
      status: 'completed',
      system: 'salesforce',
      completedAt: '2024-03-15T08:05:18Z',
    },
    {
      id: 'act_005',
      name: 'SAP',
      description: 'Revocation failed',
      status: 'failed',
      system: 'sap',
      attemptCount: 3,
      errorMessage: 'Insufficient authorization',
      errorDetails: {
        code: 'AUTHORIZATION_FAILED',
        message: 'User account lacks required SAP_BASIS authorization',
        requiredRole: 'SAP_ADMIN',
      },
      failedAt: '2024-03-15T08:15:32Z',
    },
  ],
  exception: {
    id: 'exc_001',
    severity: 'high',
    title: 'SAP Access Revocation Failed',
    aiAnalysis: {
      summary: 'SAP returned error: "Insufficient authorization"',
      rootCause: 'The integration user lacks SAP_BASIS authorization required to disable user accounts.',
      recommendations: [
        {
          action: 'Request SAP administrator approval',
          description: 'Contact SAP admin team to manually disable the account',
          priority: 'high',
        },
        {
          action: 'Update connector credentials',
          description: 'Grant SAP_ADMIN role to the integration service account',
          priority: 'medium',
        },
        {
          action: 'Create manual process',
          description: 'Add SAP revocation to IT checklist for manual processing',
          priority: 'low',
        },
      ],
    },
  },
};

export default function ExecutionDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link 
              href="/dashboard" 
              className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">{mockExecution.employee.name}</h1>
            <p className="text-muted-foreground">{mockExecution.workflow.name}</p>
          </div>
          <Badge variant="destructive" className="text-lg px-4 py-2">
            {mockExecution.status}
          </Badge>
        </div>

        {/* Employee Info */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{mockExecution.employee.email}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Department</div>
              <div className="font-medium">{mockExecution.employee.department}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Termination Date</div>
              <div className="font-medium">{mockExecution.employee.terminationDate}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Workflow Started</div>
              <div className="font-medium">
                {new Date(mockExecution.workflow.startedAt).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>System access revocation progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockExecution.actions.map((action) => (
              <div key={action.id} className="flex items-start space-x-4">
                <div className="mt-1">
                  {action.status === 'completed' ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : action.status === 'failed' ? (
                    <XCircle className="h-6 w-6 text-red-500" />
                  ) : (
                    <Clock className="h-6 w-6 text-orange-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{action.name}</h3>
                    {action.verificationStatus === 'verified' && (
                      <Badge variant="outline" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                  {action.status === 'failed' && action.errorMessage && (
                    <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                      Error: {action.errorMessage}
                      {action.attemptCount && (
                        <span className="ml-2 text-muted-foreground">
                          ({action.attemptCount} attempts)
                        </span>
                      )}
                    </div>
                  )}
                  {action.completedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(action.completedAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Analysis */}
        {mockExecution.exception && (
          <Card className="border-orange-200 dark:border-orange-900">
            <CardHeader>
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <CardTitle className="text-orange-700 dark:text-orange-400">
                    AI Analysis
                  </CardTitle>
                  <CardDescription>
                    Automated root cause analysis and recommendations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Summary</AlertTitle>
                <AlertDescription>
                  {mockExecution.exception.aiAnalysis.summary}
                </AlertDescription>
              </Alert>

              <div>
                <h4 className="font-semibold mb-2">Root Cause</h4>
                <p className="text-sm text-muted-foreground">
                  {mockExecution.exception.aiAnalysis.rootCause}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Recommended Actions</h4>
                <div className="space-y-3">
                  {mockExecution.exception.aiAnalysis.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">{rec.action}</h5>
                        <Badge
                          variant={
                            rec.priority === 'high'
                              ? 'destructive'
                              : rec.priority === 'medium'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {rec.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {rec.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <Button variant="default">
            Retry Failed Actions
          </Button>
          <Button variant="outline">
            Create IT Ticket
          </Button>
          <Button variant="outline">
            Escalate to Manager
          </Button>
        </div>

        {/* Exception Link */}
        {mockExecution.exception && (
          <Card>
            <CardContent className="pt-6">
              <Link
                href={`/dashboard/exceptions/${mockExecution.exception.id}`}
                className="text-sm text-primary hover:underline"
              >
                View full exception details →
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
