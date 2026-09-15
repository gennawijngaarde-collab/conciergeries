/**
 * Dashboard Layout
 * Provides navigation and structure for all dashboard pages
 */

import Link from 'next/link';
import { Home, Activity, AlertTriangle, Settings, Workflow, Cable } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Events', href: '/dashboard/events', icon: Activity },
  { name: 'Workflows', href: '/dashboard/workflows', icon: Workflow },
  { name: 'Exceptions', href: '/dashboard/exceptions', icon: AlertTriangle },
  { name: 'Connectors', href: '/dashboard/connectors', icon: Cable },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/10">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="font-bold text-xl">
            HR SyncGuard
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
