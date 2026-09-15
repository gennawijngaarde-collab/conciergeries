import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full">
        <h1 className="text-6xl font-bold mb-4">HR SyncGuard AI</h1>
        <p className="text-xl text-muted-foreground mb-8">
          International HR/IT process orchestration platform
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
          <Link 
            href="/dashboard"
            className="p-6 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Dashboard →</h2>
            <p className="text-muted-foreground">
              View events, workflows, and system status
            </p>
          </Link>
          
          <Link 
            href="/events"
            className="p-6 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Events →</h2>
            <p className="text-muted-foreground">
              Browse and manage HR events
            </p>
          </Link>
          
          <Link 
            href="/workflows"
            className="p-6 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Workflows →</h2>
            <p className="text-muted-foreground">
              Configure and monitor workflows
            </p>
          </Link>
          
          <Link 
            href="/connectors"
            className="p-6 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Connectors →</h2>
            <p className="text-muted-foreground">
              Manage HRIS and action system integrations
            </p>
          </Link>
        </div>
        
        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Architecture Highlights</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>✅ HRIS-agnostic core with universal HR data model</li>
            <li>✅ Event-driven architecture with retry & verification</li>
            <li>✅ Multi-tenant SaaS with row-level security</li>
            <li>✅ Connector-based integration layer</li>
            <li>✅ Automated workflow execution with exception handling</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
