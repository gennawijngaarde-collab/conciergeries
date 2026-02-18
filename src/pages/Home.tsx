import { Link } from 'react-router-dom';
import { ArrowRight, Check, Star, MapPin, Building2, TrendingUp, Phone, Search, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import conciergeries from '@/data/conciergeries';
import blogPosts from '@/data/blog-posts';

const Home = () => {
  // Get top 6 conciergeries by reviews
  const topConciergeries = [...conciergeries]
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 6);

  // Get latest 3 blog posts
  const latestPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const features = [
    { icon: Building2, title: '105+ Conciergeries vérifiées', description: 'Toutes nos conciergeries sont sélectionnées et évaluées selon des critères stricts de qualité.' },
    { icon: MapPin, title: 'Couverture nationale', description: 'Des conciergeries dans plus de 200 villes à travers toute la France métropolitaine.' },
    { icon: Star, title: 'Avis authentiques', description: 'Notes et commentaires réels de propriétaires et voyageurs pour vous aider à choisir.' },
    { icon: TrendingUp, title: 'Optimisation revenus', description: 'Les meilleures conciergeries pour maximiser la rentabilité de votre bien immobilier.' },
  ];

  const benefits = [
    'Gestion complète de votre location',
    'Optimisation algorithmique des prix',
    'Ménage professionnel hôtelier',
    'Accueil voyageurs 24/7',
    'Multi-plateformes (Airbnb, Booking...)',
    'Assurance et garanties incluses',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Luxury apartment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/70 to-blue-900/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">
                L'annuaire N°1 des conciergeries en France
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Trouvez la{' '}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                meilleure conciergerie
              </span>{' '}
              Airbnb pour votre bien
            </h1>

            <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Comparez les <strong>105+ meilleures conciergeries</strong> de France. Gestion complète, 
              optimisation des revenus, ménage professionnel. Trouvez le partenaire idéal en quelques clics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-12">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Dans quelle ville est votre bien ?"
                  className="w-full pl-12 pr-4 py-6 text-lg bg-white/95 backdrop-blur-sm border-0 rounded-xl shadow-xl placeholder:text-gray-500"
                />
              </div>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all"
              >
                <Link to="/conciergeries">
                  <Search className="w-5 h-5 mr-2" />
                  Rechercher
                </Link>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                asChild
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-6 py-5 text-base rounded-xl"
              >
                <Link to="/conciergeries">
                  Voir toutes les conciergeries
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-amber-950 px-6 py-5 text-base rounded-xl"
            >
              <Link to="/devis">
                Obtenir des devis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <span className="text-3xl sm:text-4xl font-bold text-white">105+</span>
                </div>
                <span className="text-white/70 text-sm">Conciergeries</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="text-3xl sm:text-4xl font-bold text-white">200+</span>
                </div>
                <span className="text-white/70 text-sm">Villes couvertes</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-blue-400" />
                  <span className="text-3xl sm:text-4xl font-bold text-white">4.5</span>
                </div>
                <span className="text-white/70 text-sm">Note moyenne</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              Pourquoi nous choisir
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              L'annuaire de référence des conciergeries Airbnb
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nous sélectionnons pour vous les meilleures conciergeries de France pour 
              une gestion locative sereine et rentable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Conciergeries Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
                Meilleures conciergeries
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Les conciergeries les mieux notées
              </h2>
              <p className="text-lg text-gray-600 max-w-xl">
                Découvrez les conciergeries préférées des propriétaires, sélectionnées 
                selon leurs avis et leur réputation.
              </p>
            </div>
            <Button asChild variant="outline" className="mt-6 md:mt-0">
              <Link to="/conciergeries">
                Voir toutes les conciergeries
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topConciergeries.map((conciergerie, index) => (
              <Card key={conciergerie.id} className={`group overflow-hidden hover:shadow-xl transition-shadow ${index === 0 ? 'ring-2 ring-blue-500' : ''}`}>
                <CardContent className="p-0">
                  <div className="relative h-32 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                    {index === 0 && (
                      <Badge className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 font-semibold">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Top 1
                      </Badge>
                    )}
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center overflow-hidden">
                      <img 
                        src={`/logos/${conciergerie.logo}.svg`}
                        alt={conciergerie.name}
                        className="w-16 h-16 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/logos/default.svg';
                        }}
                      />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {conciergerie.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.round(conciergerie.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {conciergerie.rating.toFixed(1)} ({conciergerie.reviews.toLocaleString()} avis)
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {conciergerie.description}
                    </p>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" className="flex-1">
                        <Link to={`/conciergerie/${conciergerie.slug}`}>
                          Détails
                        </Link>
                      </Button>
                      {conciergerie.website && (
                        <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
                          <a href={conciergerie.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Site
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-white/20 text-white hover:bg-white/20">
                Services inclus
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Une gestion locative complète et clé en main
              </h2>
              <p className="text-lg text-blue-100 mb-8">
                Les conciergeries que nous référençons proposent tous les services 
                essentiels pour une gestion sereine et rentable de votre bien.
              </p>
              <Button asChild className="bg-white text-blue-600 hover:bg-blue-50">
                <Link to="/conciergeries">
                  Trouver ma conciergerie
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4"
                >
                  <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-900" />
                  </div>
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '105+', label: 'Conciergeries partenaires' },
              { value: '200+', label: 'Villes couvertes' },
              { value: '4.5/5', label: 'Note moyenne' },
              { value: '50K+', label: 'Avis collectés' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
                Blog & Conseils
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Derniers articles du blog
              </h2>
              <p className="text-lg text-gray-600 max-w-xl">
                Conseils, guides et actualités pour réussir votre location Airbnb 
                et choisir la meilleure conciergerie.
              </p>
            </div>
            <Button asChild variant="outline" className="mt-6 md:mt-0">
              <Link to="/blog">
                Voir tous les articles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <Card key={post.id} className="group overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Badge className="absolute top-3 left-3 bg-blue-600 text-white">
                      {post.category}
                    </Badge>
                    <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center">
                      <span className="text-3xl">📝</span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <Button asChild variant="outline" className="w-full mt-auto">
                      <Link to={`/blog/${post.slug}`}>
                        Lire l'article
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Prêt à maximiser vos revenus locatifs ?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Comparez les <strong>105+ meilleures conciergeries</strong> de France et trouvez le partenaire 
            idéal pour gérer votre bien. C'est gratuit et sans engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-8 py-6 text-lg"
            >
              <Link to="/conciergeries">
                Trouver une conciergerie
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
            >
              <Link to="/contact">
                <Phone className="w-5 h-5 mr-2" />
                Nous contacter
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
