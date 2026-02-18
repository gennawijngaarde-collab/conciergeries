import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import type { Conciergerie } from '@/types/conciergerie';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { LatLngExpression } from 'leaflet';

// Fix Leaflet default icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  conciergeries: Conciergerie[];
  center?: LatLngExpression;
  zoom?: number;
}

// Coordinates for major French cities
const cityCoordinates: Record<string, [number, number]> = {
  'Paris': [48.8566, 2.3522],
  'Lyon': [45.7640, 4.8357],
  'Marseille': [43.2965, 5.3698],
  'Nice': [43.7102, 7.2620],
  'Bordeaux': [44.8378, -0.5792],
  'Toulouse': [43.6047, 1.4442],
  'Nantes': [47.2184, -1.5536],
  'Strasbourg': [48.5734, 7.7521],
  'Montpellier': [43.6108, 3.8767],
  'Lille': [50.6292, 3.0573],
  'Rennes': [48.1173, -1.6778],
  'Reims': [49.2583, 4.0317],
  'Le Havre': [49.4944, 0.1079],
  'Saint-Étienne': [45.4397, 4.3872],
  'Toulon': [43.1242, 5.9280],
  'Grenoble': [45.1885, 5.7245],
  'Dijon': [47.3220, 5.0415],
  'Angers': [47.4784, -0.5632],
  'Nîmes': [43.8367, 4.3601],
  'Aix-en-Provence': [43.5297, 5.4474],
  'Avignon': [43.9493, 4.8055],
  'Biarritz': [43.4832, -1.5586],
  'Cannes': [43.5528, 7.0174],
  'Annecy': [45.8992, 6.1290],
  'Chamonix': [45.9237, 6.8694],
  'La Rochelle': [46.1631, -1.1522],
  'Saint-Malo': [48.6493, -2.0257],
  'Colmar': [48.0794, 7.3585],
  'Perpignan': [42.6986, 2.8956],
  'Caen': [49.1829, -0.3707],
  'Rouen': [49.4431, 1.0993],
  'Nancy': [48.6921, 6.1844],
  'Metz': [49.1193, 6.1757],
  'Brest': [48.3904, -4.4861],
  'Quimper': [47.9975, -4.0979],
  'Vannes': [47.6582, -2.7599],
  'La Baule': [47.2864, -2.3929],
  'Honfleur': [49.4190, 0.2329],
  'Deauville': [49.3605, 0.0740],
  'Tours': [47.3941, 0.6848],
  'Orléans': [47.9029, 1.9086],
  'Limoges': [45.8336, 1.2611],
  'Clermont-Ferrand': [45.7772, 3.0820],
  'Besançon': [47.2378, 6.0241],
  'Mulhouse': [47.7508, 7.3359],
  'Amiens': [49.8941, 2.3023],
  'Valenciennes': [50.3583, 3.1829],
  'Dunkerque': [51.0344, 2.3768],
  'Calais': [50.9513, 1.8587],
  'Boulogne': [50.7264, 1.6147],
  'Le Mans': [48.0084, 0.1984],
  'Niort': [46.3237, -0.4648],
  'Poitiers': [46.5802, 0.3404],
  'La Roche-sur-Yon': [46.6705, -1.4260],
  'Pau': [43.2951, -0.3708],
  'Tarbes': [43.2329, 0.0735],
  'Bayonne': [43.4933, -1.4745],
  'Saint-Jean-de-Luz': [43.3889, -1.6627],
  'Carcassonne': [43.2130, 2.3491],
  'Béziers': [43.3442, 3.2158],
  'Sète': [43.4054, 3.6975],
  'Agde': [43.3108, 3.4759],
  'Cap d\'Agde': [43.2860, 3.5128],
  'Montélimar': [44.5581, 4.7508],
  'Valence': [44.9333, 4.8917],
  'Gap': [44.5591, 6.0786],
  'Briançon': [44.8955, 6.6368],
  'Chambéry': [45.5648, 5.9178],
  'Aix-les-Bains': [45.6910, 5.9086],
  'Annemasse': [46.1961, 6.2369],
  'Thonon': [46.3705, 6.4799],
  'Évian': [46.4006, 6.5896],
  'Megève': [45.8566, 6.6184],
  'Courchevel': [45.4147, 6.6344],
  'Méribel': [45.3960, 6.5660],
  'Val d\'Isère': [45.4483, 6.9803],
  'Tignes': [45.4693, 6.9076],
  'Les Arcs': [45.5725, 6.8289],
  'La Plagne': [45.5075, 6.6778],
  'Alpe d\'Huez': [45.0914, 6.0698],
  'Avoriaz': [46.1936, 6.7695],
  'Les Deux Alpes': [45.0074, 6.1216],
  'Serre Chevalier': [44.9465, 6.5582],
  'Les Menuires': [45.3236, 6.5380],
  'Flaine': [46.0038, 6.6791],
  'La Rosière': [45.6283, 6.8280],
  'Saint-Lary': [42.8172, 0.3225],
  'Piau-Engaly': [42.7808, 0.1588],
  'Peyragudes': [42.7833, 0.4167],
  'Luchon': [42.7886, 0.5931],
  'Font-Romeu': [42.5050, 2.0331],
  'Les Angles': [42.5783, 2.0733],
};

const getCityCoordinates = (cityName: string): [number, number] | null => {
  const firstCity = cityName.split(',')[0].trim().split(' ')[0];
  
  for (const [city, coords] of Object.entries(cityCoordinates)) {
    if (firstCity.toLowerCase().includes(city.toLowerCase()) || 
        city.toLowerCase().includes(firstCity.toLowerCase())) {
      return coords;
    }
  }
  
  return null;
};

const Map = ({ conciergeries, center = [46.2276, 2.2137], zoom = 6 }: MapProps) => {
  // Filter conciergeries that have valid coordinates
  const validConciergeries = useMemo(() => {
    return conciergeries.map(c => ({
      ...c,
      coords: getCityCoordinates(c.city)
    })).filter(c => c.coords !== null) as (Conciergerie & { coords: [number, number] })[];
  }, [conciergeries]);

  return (
    <MapContainer
      center={center as LatLngExpression}
      zoom={zoom}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validConciergeries.map((conciergerie) => (
        <Marker
          key={conciergerie.id}
          position={conciergerie.coords as LatLngExpression}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-gray-900 mb-1">{conciergerie.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{conciergerie.city}</p>
              <div className="flex items-center gap-1 mb-2">
                <span className="text-yellow-500">★</span>
                <span className="text-sm font-medium">{conciergerie.rating}</span>
                <span className="text-sm text-gray-500">({conciergerie.reviews} avis)</span>
              </div>
              <Link
                to={`/conciergerie/${conciergerie.slug}`}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Voir la fiche →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
