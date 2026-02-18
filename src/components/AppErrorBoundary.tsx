import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export default class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Keep a console trace for debugging (especially in dev)
    // eslint-disable-next-line no-console
    console.error('App crashed:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <Card>
            <CardContent className="p-8 sm:p-10">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Une erreur est survenue
                </h1>
                <p className="text-gray-600 mb-6">
                  L’application a rencontré un problème. Tu peux recharger la page ou revenir à l’accueil.
                </p>

                {import.meta.env.DEV && this.state.error?.message && (
                  <pre className="w-full text-left text-xs bg-gray-100 p-4 rounded-lg overflow-auto mb-6">
                    {this.state.error.message}
                  </pre>
                )}

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Recharger
                  </Button>
                  <Button asChild variant="outline">
                    <a href={import.meta.env.BASE_URL}>Retour à l’accueil</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

