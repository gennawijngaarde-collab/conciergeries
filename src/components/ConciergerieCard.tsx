import { Link } from 'react-router-dom';
import { Star, MapPin, Phone, Mail, ExternalLink, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Conciergerie } from '@/types/conciergerie';

interface ConciergerieCardProps {
  conciergerie: Conciergerie;
  featured?: boolean;
}

const ConciergerieCard = ({ conciergerie, featured = false }: ConciergerieCardProps) => {
  // Get logo URL based on conciergerie logo field
  const getLogoUrl = (logo: string) => {
    return `/logos/${logo}.svg`;
  };

  const planBadge =
    conciergerie.listingPlan === 'premium' ? (
      <Badge className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 font-semibold hover:bg-yellow-400">
        <Crown className="w-3 h-3 mr-1" />
        Premium
      </Badge>
    ) : conciergerie.listingPlan === 'standard' ? (
      <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900 font-semibold hover:bg-white/90">
        Standard
      </Badge>
    ) : null;

  return (
    <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-xl ${
      featured ? 'ring-2 ring-blue-500 ring-offset-2' : ''
    }`}>
      <CardContent className="p-0">
        {/* Header with Logo */}
        <div className="relative h-32 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
          {planBadge}
          {featured && (
            <Badge className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 font-semibold">
              Recommandé
            </Badge>
          )}
          <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center overflow-hidden">
            <img 
              src={getLogoUrl(conciergerie.logo)} 
              alt={conciergerie.name}
              className="w-16 h-16 object-contain"
              onError={(e) => {
                // Fallback to default logo if the specific one fails
                (e.target as HTMLImageElement).src = '/logos/default.svg';
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title & Rating */}
          <div className="mb-3">
            <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {conciergerie.name}
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
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

          {/* Location */}
          <div className="flex items-start gap-2 mb-3">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-600 line-clamp-1">{conciergerie.city}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
            {conciergerie.description}
          </p>

          {/* Services Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {conciergerie.services.slice(0, 3).map((service, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {service}
              </Badge>
            ))}
            {conciergerie.services.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{conciergerie.services.length - 3}
              </Badge>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-2 mb-4">
            {conciergerie.phone && (
              <a
                href={`tel:${conciergerie.phone}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                {conciergerie.phone}
              </a>
            )}
            {conciergerie.email && (
              <a
                href={`mailto:${conciergerie.email}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="truncate">{conciergerie.email}</span>
              </a>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              className="flex-1"
            >
              <Link to={`/conciergerie/${conciergerie.slug}`}>
                Détails
              </Link>
            </Button>
            {conciergerie.website && (
              <Button
                asChild
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
              >
                <a
                  href={conciergerie.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Site web
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConciergerieCard;
