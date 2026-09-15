/**
 * HR SyncGuard AI - Main Dashboard
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// This would come from API/database in production
const mockStats = {
  employeesMonitored: 4821,
  activeWorkflows: 127,
  successfulExecutions: 118,
  exceptions: 9,
};

const mockRecentExecutions = [
  {
    id: 'wfex_001',
    employeeName: 'Jean Dupont',
    workflowType: 'Offboarding',
    status: 'completed',
    statusIcon: '🟢',
    completedAt: '2024-03-15T10:30:00Z',
  },
  {
    id: 'wfex_002',
    employeeName: 'Maria Martin',
    workflowType: 'Onboarding',
    status: 'completed',
    statusIcon: '🟢',
    completedAt: '2024-03-15T09:15:00Z',
  },
  {
    id: 'wfex_003',
    employeeName: 'Paul Bernard',
    workflowType: 'Job Change',
    status: 'running',
    statusIcon: '🟠',
    message: '2 actions pending',
  },
  {
    id: 'wfex_004',
    employeeName: 'Thomas Leroy',
    workflowType: 'Offboarding',
    status: 'failed',
    statusIcon: '🔴',
    message: 'SAP access could not be revoked',
    exceptionId: 'exc_001',
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">HR SyncGuard AI</h1>
          <p className="text-muted-foreground mt-2">
            International HR/IT Process Orchestration Platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Employees Monitored</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {mockStats.employeesMonitored.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {mockStats.activeWorkflows}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Successful Executions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {mockStats.successfulExecutions}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Exceptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {mockStats.exceptions}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Executions */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Executions</CardTitle>
            <CardDescription>Recent workflow activity across all tenants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentExecutions.map((execution) => (
                <Link
                  key={execution.id}
                  href={`/dashboard/executions/${execution.id}`}
                  className="block"
                >
                  <div className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                    <div className="text-2xl mt-1">{execution.statusIcon}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{execution.employeeName}</h3>
                        <Badge
                          variant={
                            execution.status === 'completed'
                              ? 'default'
                              : execution.status === 'running'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {execution.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {execution.workflowType}
                      </p>
                      {execution.message && (
                        <p className="text-sm text-orange-600 dark:text-orange-400">
                          {execution.message}
                        </p>
                      )}
                      {execution.completedAt && (
                        <p className="text-xs text-muted-foreground">
                          Completed {new Date(execution.completedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6">
              <Link
                href="/dashboard/executions"
                className="text-sm text-primary hover:underline"
              >
                View all executions →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dashboard/events">
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Events</CardTitle>
                <CardDescription>View incoming HR events</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/exceptions">
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Exceptions</CardTitle>
                <CardDescription>
                  {mockStats.exceptions} open exceptions
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/workflows">
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Workflows</CardTitle>
                <CardDescription>Configure workflows</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
