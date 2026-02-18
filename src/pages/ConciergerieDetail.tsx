import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Phone, Mail, Globe, Check, ExternalLink, Building2, Award, TrendingUp, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import conciergeries from '@/data/conciergeries';

const ConciergerieDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const conciergerie = conciergeries.find(c => c.slug === slug);
  
  if (!conciergerie) {
    return <Navigate to="/conciergeries" replace />;
  }

  // Get similar conciergeries
  const similarConciergeries = conciergeries
    .filter(c => 
      c.id !== conciergerie.id && 
      (c.city.includes(conciergerie.city.split(',')[0]) || 
       c.services.some(s => conciergerie.services.includes(s)))
    )
    .slice(0, 3);

  // Get logo URL
  const getLogoUrl = (logo: string) => {
    return `/logos/${logo}.svg`;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/conciergeries"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux conciergeries
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Logo */}
            <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img 
                src={getLogoUrl(conciergerie.logo)} 
                alt={conciergerie.name}
                className="w-20 h-20 lg:w-28 lg:h-28 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logos/default.svg';
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="bg-white/20 text-white hover:bg-white/30">
                  Conciergerie Airbnb
                </Badge>
                {conciergerie.listingPlan === 'premium' && (
                  <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
                {conciergerie.listingPlan === 'standard' && (
                  <Badge className="bg-white/20 text-white hover:bg-white/30">
                    Standard
                  </Badge>
                )}
                {conciergerie.loyer_garanti && (
                  <Badge className="bg-green-400 text-green-900">
                    <Award className="w-3 h-3 mr-1" />
                    Loyer garanti
                  </Badge>
                )}
                {conciergerie.rating >= 4.5 && (
                  <Badge className="bg-yellow-400 text-yellow-900">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Top rated
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold mb-4">{conciergerie.name}</h1>

              <div className="flex items-center gap-2 mb-4">
                {renderStars(conciergerie.rating)}
                <span className="text-lg">
                  {conciergerie.rating.toFixed(1)} ({conciergerie.reviews.toLocaleString()} avis)
                </span>
              </div>

              <div className="flex items-start gap-2 text-white/80 mb-4">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{conciergerie.city}</span>
              </div>

              {conciergerie.commission && (
                <div className="flex items-center gap-2 text-white/80">
                  <TrendingUp className="w-5 h-5 flex-shrink-0" />
                  <span>Commission: {conciergerie.commission}</span>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3 w-full lg:w-auto">
              {conciergerie.website && (
                <Button
                  asChild
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8"
                >
                  <a href={conciergerie.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visiter le site
                  </a>
                </Button>
              )}
              {conciergerie.phone && (
                <Button
                  asChild
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <a href={`tel:${conciergerie.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Appeler
                  </a>
                </Button>
              )}
              {conciergerie.email && (
                <Button
                  asChild
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <a href={`mailto:${conciergerie.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Envoyer un email
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="about">À propos</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      À propos de {conciergerie.name}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {conciergerie.description}
                    </p>
                    
                    <h3 className="font-semibold text-gray-900 mb-3">Plateformes supportées</h3>
                    <div className="flex flex-wrap gap-2">
                      {conciergerie.platforms.map((platform, index) => (
                        <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4">Résumé</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-blue-100">Note</span>
                        <span className="font-semibold">{conciergerie.rating.toFixed(1)}/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-100">Avis</span>
                        <span className="font-semibold">{conciergerie.reviews.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-100">Commission</span>
                        <span className="font-semibold">{conciergerie.commission}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-100">Loyer garanti</span>
                        <span className="font-semibold">{conciergerie.loyer_garanti ? 'Oui' : 'Non'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Services proposés
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {conciergerie.services.map((service, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Coordonnées
                </h2>
                <div className="space-y-4">
                  {conciergerie.phone && (
                    <a
                      href={`tel:${conciergerie.phone}`}
                      className="flex items-center gap-4 text-gray-600 hover:text-blue-600 transition-colors p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="font-medium">{conciergerie.phone}</p>
                      </div>
                    </a>
                  )}

                  {conciergerie.email && (
                    <a
                      href={`mailto:${conciergerie.email}`}
                      className="flex items-center gap-4 text-gray-600 hover:text-blue-600 transition-colors p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{conciergerie.email}</p>
                      </div>
                    </a>
                  )}

                  {conciergerie.website && (
                    <a
                      href={conciergerie.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 text-gray-600 hover:text-blue-600 transition-colors p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Site web</p>
                        <p className="font-medium truncate max-w-[200px]">
                          {conciergerie.website.replace(/^https?:\/\//, '')}
                        </p>
                      </div>
                    </a>
                  )}

                  {conciergerie.address && (
                    <div className="flex items-center gap-4 text-gray-600 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Adresse</p>
                        <p className="font-medium">{conciergerie.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Similar Conciergeries */}
      {similarConciergeries.length > 0 && (
        <div className="bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Conciergeries similaires
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarConciergeries.map((c) => (
                <Card key={c.id} className="group overflow-hidden hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative h-32 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
                        <img 
                          src={getLogoUrl(c.logo)} 
                          alt={c.name}
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/logos/default.svg';
                          }}
                        />
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {c.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">
                          {c.rating.toFixed(1)} ({c.reviews} avis)
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {c.description}
                      </p>
                      <Button asChild variant="outline" className="w-full">
                        <Link to={`/conciergerie/${c.slug}`}>
                          Voir la fiche
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConciergerieDetail;
