import { Link, useLocation } from 'react-router-dom';
import { Home, Search, BookOpen, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-[60vh] bg-gray-50 flex items-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <Card className="overflow-hidden">
          <CardContent className="p-8 sm:p-10">
            <div className="flex flex-col items-center text-center">
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
                Page introuvable
              </Badge>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Oups, cette page n’existe pas
              </h1>
              <p className="text-gray-600 mb-6 max-w-xl">
                L’adresse demandée ne correspond à aucune page. On t’évite un écran blanc et on te
                propose des raccourcis pour continuer.
              </p>

              <div className="text-sm text-gray-500 mb-8 w-full">
                <span className="font-medium text-gray-700">URL</span>:{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  {location.pathname}
                  {location.search}
                </code>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
                  <Link to="/">
                    <Home className="w-4 h-4 mr-2" />
                    Retour à l’accueil
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/conciergeries">
                    <Search className="w-4 h-4 mr-2" />
                    Voir les conciergeries
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/blog">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Lire le blog
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/contact">
                    <Mail className="w-4 h-4 mr-2" />
                    Contacter
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;

