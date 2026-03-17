import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, Grid3X3, Map as MapIcon, X, Star, ExternalLink, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Map from '@/components/Map';
import staticConciergeries from '@/data/conciergeries';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import type { Conciergerie } from '@/types/conciergerie';

const Conciergeries = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('city') || '');
  const [minRating, setMinRating] = useState(0);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [conciergeries, setConciergeries] = useState<Conciergerie[]>(staticConciergeries as unknown as Conciergerie[]);
  const [myProfileSlug, setMyProfileSlug] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadPartners() {
      try {
        const { data, error } = await supabase
          .from('partner_profiles')
          .select('*')
          .order('updated_at', { ascending: false });
        if (error) throw error;
        const partners = ((data as any[]) ?? []).map((p) => {
          const plan = String(p.plan ?? 'standard').toLowerCase() === 'premium' ? 'premium' : 'standard';
          const mapped: Conciergerie = {
            id: p.id,
            name: p.name,
            slug: p.slug,
            city: p.city,
            rating: 5,
            reviews: 0,
            website: p.website ?? null,
            phone: p.phone ?? null,
            email: p.email ?? null,
            address: p.address ?? null,
            description: p.description,
            logo: 'default',
            logoUrl: p.logo_url ?? undefined,
            services: Array.isArray(p.services) ? p.services : [],
            platforms: Array.isArray(p.platforms) ? p.platforms : [],
            listingPlan: plan,
          };
          return mapped;
        });
        if (!mounted) return;
        setConciergeries([...(staticConciergeries as any), ...partners]);
      } catch {
        // ignore: keep static list
      }
    }
    void loadPartners();
    return () => {
      mounted = false;
    };
  }, []);

  // Ensure the logged-in partner can always find their own profile (even if not public yet).
  useEffect(() => {
    let mounted = true;
    async function loadMyProfile() {
      if (!user) {
        setMyProfileSlug(null);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('partner_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        if (error) throw error;
        if (!mounted) return;
        if (!data) {
          setMyProfileSlug(null);
          return;
        }
        const p: any = data;
        const plan = String(p.plan ?? 'standard').toLowerCase() === 'premium' ? 'premium' : 'standard';
        const mapped: Conciergerie = {
          id: p.id,
          name: p.name,
          slug: p.slug,
          city: p.city,
          rating: 5,
          reviews: 0,
          website: p.website ?? null,
          phone: p.phone ?? null,
          email: p.email ?? null,
          address: p.address ?? null,
          description: p.description,
          logo: 'default',
          logoUrl: p.logo_url ?? undefined,
          services: Array.isArray(p.services) ? p.services : [],
          platforms: Array.isArray(p.platforms) ? p.platforms : [],
          listingPlan: plan,
        };
        setMyProfileSlug(mapped.slug);
        setConciergeries((prev) => {
          const without = prev.filter((c) => c.slug !== mapped.slug);
          return [...without, mapped];
        });
      } catch {
        if (!mounted) return;
        setMyProfileSlug(null);
      }
    }
    void loadMyProfile();

    const onChanged = () => void loadMyProfile();
    window.addEventListener('partner-profile:changed', onChanged);
    return () => {
      mounted = false;
      window.removeEventListener('partner-profile:changed', onChanged);
    };
  }, [user]);

  // Extract unique services and platforms
  const allServices = useMemo(() => {
    const services = new Set<string>();
    conciergeries.forEach(c => c.services.forEach(s => services.add(s)));
    return [...services].sort();
  }, [conciergeries]);

  const allPlatforms = useMemo(() => {
    const platforms = new Set<string>();
    conciergeries.forEach(c => c.platforms.forEach(p => platforms.add(p)));
    return [...platforms].sort();
  }, [conciergeries]);

  // Filter conciergeries
  const filteredConciergeries = useMemo(() => {
    return conciergeries.filter((c) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          c.name.toLowerCase().includes(query) ||
          c.city.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (c.rating < minRating) return false;
      if (selectedServices.length > 0) {
        const hasService = selectedServices.some(s => c.services.includes(s));
        if (!hasService) return false;
      }
      if (selectedPlatforms.length > 0) {
        const hasPlatform = selectedPlatforms.some(p => c.platforms.includes(p));
        if (!hasPlatform) return false;
      }
      return true;
    });
  }, [conciergeries, searchQuery, minRating, selectedServices, selectedPlatforms]);

  // Prioritize paid listings in directory: Premium first, then Standard, then others.
  const prioritizedConciergeries = useMemo(() => {
    const planRank = (c: Conciergerie) => {
      const p = String(c.listingPlan ?? '').toLowerCase();
      if (p === 'premium') return 2;
      if (p === 'standard') return 1;
      return 0;
    };
    const hasPartnerSignals = (c: Conciergerie) => Boolean(c.logoUrl);

    return [...filteredConciergeries].sort((a, b) => {
      const r = planRank(b) - planRank(a);
      if (r !== 0) return r;

      // Within the same plan, prefer subscribed/partner profiles when detectable.
      const pr = Number(hasPartnerSignals(b)) - Number(hasPartnerSignals(a));
      if (pr !== 0) return pr;

      // Then by popularity/quality.
      const rr = (b.reviews ?? 0) - (a.reviews ?? 0);
      if (rr !== 0) return rr;
      const rating = (b.rating ?? 0) - (a.rating ?? 0);
      if (rating !== 0) return rating;

      // Stable fallback.
      return String(a.name).localeCompare(String(b.name), 'fr', { sensitivity: 'base' });
    });
  }, [filteredConciergeries]);

  const getLogoSrc = (c: Conciergerie) => {
    if (c.logoUrl) return c.logoUrl;
    return `/logos/${c.logo}.svg`;
  };

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setMinRating(0);
    setSelectedServices([]);
    setSelectedPlatforms([]);
  };

  const activeFiltersCount = 
    (searchQuery ? 1 : 0) + 
    (minRating > 0 ? 1 : 0) + 
    selectedServices.length + 
    selectedPlatforms.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Annuaire des conciergeries Airbnb
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Comparez et trouvez la meilleure conciergerie pour gérer votre location 
            courte durée. <strong>{conciergeries.length} conciergeries</strong> référencées en France.
          </p>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white border-b sticky top-16 lg:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher par ville ou nom..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3"
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filtres
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-2 bg-blue-600">{activeFiltersCount}</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-96">
                <SheetHeader>
                  <SheetTitle>Filtres</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Note minimum: {minRating > 0 ? `${minRating}+ étoiles` : 'Toutes'}
                    </label>
                    <Slider
                      value={[minRating]}
                      onValueChange={(value) => setMinRating(value[0])}
                      max={5}
                      step={0.5}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-3 block">Services</label>
                    <div className="space-y-2">
                      {allServices.map((service) => (
                        <div key={service} className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedServices.includes(service)}
                            onCheckedChange={() => toggleService(service)}
                          />
                          <span className="text-sm">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-3 block">Plateformes</label>
                    <div className="space-y-2">
                      {allPlatforms.map((platform) => (
                        <div key={platform} className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedPlatforms.includes(platform)}
                            onCheckedChange={() => togglePlatform(platform)}
                          />
                          <span className="text-sm">{platform}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button onClick={clearFilters} variant="outline" className="w-full">
                    Réinitialiser les filtres
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                className="flex-1 lg:flex-none"
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Grille
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                onClick={() => setViewMode('map')}
                className="flex-1 lg:flex-none"
              >
                <MapIcon className="w-4 h-4 mr-2" />
                Carte
              </Button>
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-gray-500">Filtres actifs:</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  {searchQuery}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                </Badge>
              )}
              {minRating > 0 && (
                <Badge variant="secondary" className="gap-1">
                  {minRating}+ étoiles
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setMinRating(0)} />
                </Badge>
              )}
              {selectedServices.map((service) => (
                <Badge key={service} variant="secondary" className="gap-1">
                  {service}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => toggleService(service)} />
                </Badge>
              ))}
              {selectedPlatforms.map((platform) => (
                <Badge key={platform} variant="secondary" className="gap-1">
                  {platform}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => togglePlatform(platform)} />
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Tout effacer
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-40 space-y-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Filtres</h3>
                    {activeFiltersCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Réinitialiser
                      </Button>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="text-sm font-medium mb-3 block">
                      Note minimum: {minRating > 0 ? `${minRating}+` : 'Toutes'}
                    </label>
                    <Slider
                      value={[minRating]}
                      onValueChange={(value) => setMinRating(value[0])}
                      max={5}
                      step={0.5}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="text-sm font-medium mb-3 block">Services</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {allServices.map((service) => (
                        <div key={service} className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedServices.includes(service)}
                            onCheckedChange={() => toggleService(service)}
                          />
                          <span className="text-sm">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">Plateformes</label>
                    <div className="space-y-2">
                      {allPlatforms.map((platform) => (
                        <div key={platform} className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedPlatforms.includes(platform)}
                            onCheckedChange={() => togglePlatform(platform)}
                          />
                          <span className="text-sm">{platform}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{filteredConciergeries.length}</span>{' '}
                conciergerie{filteredConciergeries.length > 1 ? 's' : ''} trouvée
                {filteredConciergeries.length > 1 ? 's' : ''}
              </p>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {prioritizedConciergeries.map((conciergerie) => (
                  <Card key={conciergerie.id} className="group overflow-hidden hover:shadow-xl transition-shadow">
                    <CardContent className="p-0">
                      <div className="relative h-32 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                        {conciergerie.listingPlan === 'premium' && (
                          <Badge className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 font-semibold hover:bg-yellow-400">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                        {conciergerie.listingPlan === 'standard' && (
                          <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900 font-semibold hover:bg-white/90">
                            Standard
                          </Badge>
                        )}
                        {myProfileSlug && conciergerie.slug === myProfileSlug && (
                          <Badge className="absolute top-3 right-3 bg-white/15 text-white border border-white/30 hover:bg-white/15">
                            Votre fiche
                          </Badge>
                        )}
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center overflow-hidden">
                          <img 
                            src={getLogoSrc(conciergerie)}
                            alt={conciergerie.name}
                            className="w-16 h-16 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/logos/default.svg';
                            }}
                          />
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="mb-3">
                          <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {conciergerie.name}
                          </h3>
                          <div className="flex items-center gap-2">
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
                        </div>
                        <div className="flex items-start gap-2 mb-3">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 line-clamp-1">{conciergerie.city}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                          {conciergerie.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {conciergerie.services.slice(0, 3).map((service, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
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
            ) : (
              <Card className="h-[600px] overflow-hidden">
                <Map conciergeries={prioritizedConciergeries} />
              </Card>
            )}

            {filteredConciergeries.length === 0 && (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucune conciergerie trouvée
                </h3>
                <p className="text-gray-600 mb-4">
                  Essayez de modifier vos critères de recherche ou de supprimer les filtres.
                </p>
                <Button onClick={clearFilters}>Réinitialiser les filtres</Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conciergeries;
