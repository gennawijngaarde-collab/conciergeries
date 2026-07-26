import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { PageHeader } from '@/shared/ui/PageHeader';
import { useAuth } from '@/shared/auth/AuthProvider';
import { api } from '@/shared/api/client';
import type { Property } from '../hooks/useProperties';

const propertySchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  propertyType: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().default('FR'),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  capacity: z.coerce.number().int().min(1),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().min(0),
  basePrice: z.coerce.number().min(0),
  touristTax: z.coerce.number().min(0).optional(),
  deposit: z.coerce.number().min(0).optional(),
  checkInTime: z.string(),
  checkOutTime: z.string(),
  houseRules: z.string().optional(),
  digitalGuide: z.string().optional(),
  amenitiesNotes: z.string().optional(),
  photoUrls: z.string().optional(),
  videoUrls: z.string().optional(),
});

type FormState = z.infer<typeof propertySchema>;

const AMENITY_OPTIONS = [
  'Wifi',
  'Cuisine',
  'Lave-linge',
  'Sèche-linge',
  'Climatisation',
  'Chauffage',
  'Parking',
  'Ascenseur',
  'Piscine',
  'Espace de travail',
];

const defaults: FormState = {
  name: '',
  description: '',
  propertyType: 'apartment',
  addressLine1: '',
  addressLine2: '',
  city: '',
  postalCode: '',
  country: 'FR',
  latitude: '',
  longitude: '',
  capacity: 2,
  bedrooms: 1,
  bathrooms: 1,
  basePrice: 0,
  touristTax: 0,
  deposit: 0,
  checkInTime: '16:00',
  checkOutTime: '11:00',
  houseRules: '',
  digitalGuide: '',
  amenitiesNotes: '',
  photoUrls: '',
  videoUrls: '',
};

function propertyToForm(p: Property): FormState {
  return {
    ...defaults,
    name: String(p.name ?? ''),
    description: String(p.description ?? ''),
    propertyType: String(p.propertyType ?? 'apartment'),
    addressLine1: String(p.addressLine1 ?? ''),
    addressLine2: String(p.addressLine2 ?? ''),
    city: String(p.city ?? ''),
    postalCode: String(p.postalCode ?? ''),
    country: String(p.country ?? 'FR'),
    latitude: p.latitude != null ? String(p.latitude) : '',
    longitude: p.longitude != null ? String(p.longitude) : '',
    capacity: Number(p.capacity ?? 2),
    bedrooms: Number(p.bedrooms ?? 1),
    bathrooms: Number(p.bathrooms ?? 1),
    basePrice: Number(p.basePrice ?? 0),
    touristTax: Number(p.touristTax ?? 0),
    deposit: Number(p.deposit ?? 0),
    checkInTime: String(p.checkInTime ?? '16:00'),
    checkOutTime: String(p.checkOutTime ?? '11:00'),
    houseRules: String(p.houseRules ?? ''),
    amenitiesNotes: String(p.amenitiesNotes ?? ''),
  };
}

export function PropertyFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [form, setForm] = useState<FormState>(defaults);
  const [amenities, setAmenities] = useState<string[]>(['Wifi', 'Cuisine']);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(isEdit);
  const [saveError, setSaveError] = useState<string | null>(null);

  const title = useMemo(
    () => (isEdit ? 'Modifier le logement' : 'Nouveau logement'),
    [isEdit],
  );

  useEffect(() => {
    if (!isEdit || !id) return;
    let cancelled = false;
    setLoadingEdit(true);
    api
      .get<Property>(`/api/v1/properties/${id}`, { token: accessToken })
      .then((p) => {
        if (cancelled) return;
        setForm(propertyToForm(p));
        if (Array.isArray(p.amenities)) {
          setAmenities(p.amenities.map(String));
        }
      })
      .catch((err) => {
        if (!cancelled) setSaveError((err as Error).message || 'Chargement impossible');
      })
      .finally(() => {
        if (!cancelled) setLoadingEdit(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isEdit, id, accessToken]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleAmenity(code: string) {
    setAmenities((prev) =>
      prev.includes(code) ? prev.filter((a) => a !== code) : [...prev, code],
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaveError(null);
    const parsed = propertySchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? 'form');
        next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setSaving(true);

    const payload = {
      ...parsed.data,
      latitude: parsed.data.latitude ? Number(parsed.data.latitude) : null,
      longitude: parsed.data.longitude ? Number(parsed.data.longitude) : null,
      amenities,
      photos: (parsed.data.photoUrls ?? '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      videos: (parsed.data.videoUrls ?? '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      digitalGuide: parsed.data.digitalGuide
        ? { markdown: parsed.data.digitalGuide }
        : null,
    };

    try {
      if (isEdit && id) {
        await api.patch(`/api/v1/properties/${id}`, payload, { token: accessToken });
      } else {
        await api.post<{ id: string }>('/api/v1/properties', payload, {
          token: accessToken,
        });
      }
      navigate('/properties');
    } catch (err) {
      setSaveError((err as Error).message || 'Échec de l’enregistrement');
    } finally {
      setSaving(false);
    }
  }

  if (loadingEdit) {
    return <p className="text-sm text-slate-400">Chargement du logement…</p>;
  }

  return (
    <div>
      <PageHeader
        title={title}
        description="Photos, adresse, capacité, tarifs, règles et guide digital."
        actions={
          <Link to={isEdit && id ? `/properties/${id}` : '/properties'} className="btn-secondary">
            Annuler
          </Link>
        }
      />

      <form onSubmit={onSubmit} className="space-y-6">
        <section className="panel grid gap-4 sm:grid-cols-2">
          <h2 className="sm:col-span-2 text-sm font-semibold text-slate-900">Informations</h2>
          <div className="sm:col-span-2">
            <label className="label-field" htmlFor="name">
              Nom
            </label>
            <input
              id="name"
              className="input-field"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
            />
            {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
          </div>
          <div>
            <label className="label-field" htmlFor="propertyType">
              Type
            </label>
            <select
              id="propertyType"
              className="input-field"
              value={form.propertyType}
              onChange={(e) => setField('propertyType', e.target.value)}
            >
              <option value="apartment">Appartement</option>
              <option value="house">Maison</option>
              <option value="studio">Studio</option>
              <option value="villa">Villa</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label-field" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              className="input-field"
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
            />
          </div>
        </section>

        <section className="panel grid gap-4 sm:grid-cols-2">
          <h2 className="sm:col-span-2 text-sm font-semibold text-slate-900">Adresse</h2>
          <div className="sm:col-span-2">
            <label className="label-field" htmlFor="addressLine1">
              Adresse
            </label>
            <input
              id="addressLine1"
              className="input-field"
              value={form.addressLine1}
              onChange={(e) => setField('addressLine1', e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label-field" htmlFor="addressLine2">
              Complément
            </label>
            <input
              id="addressLine2"
              className="input-field"
              value={form.addressLine2}
              onChange={(e) => setField('addressLine2', e.target.value)}
            />
          </div>
          <div>
            <label className="label-field" htmlFor="city">
              Ville
            </label>
            <input
              id="city"
              className="input-field"
              value={form.city}
              onChange={(e) => setField('city', e.target.value)}
            />
          </div>
          <div>
            <label className="label-field" htmlFor="postalCode">
              Code postal
            </label>
            <input
              id="postalCode"
              className="input-field"
              value={form.postalCode}
              onChange={(e) => setField('postalCode', e.target.value)}
            />
          </div>
          <div>
            <label className="label-field" htmlFor="country">
              Pays
            </label>
            <input
              id="country"
              className="input-field"
              value={form.country}
              onChange={(e) => setField('country', e.target.value)}
            />
          </div>
          <div>
            <label className="label-field" htmlFor="latitude">
              Latitude
            </label>
            <input
              id="latitude"
              className="input-field"
              placeholder="48.8566"
              value={form.latitude}
              onChange={(e) => setField('latitude', e.target.value)}
            />
          </div>
          <div>
            <label className="label-field" htmlFor="longitude">
              Longitude
            </label>
            <input
              id="longitude"
              className="input-field"
              placeholder="2.3522"
              value={form.longitude}
              onChange={(e) => setField('longitude', e.target.value)}
            />
          </div>
        </section>

        <section className="panel grid gap-4 sm:grid-cols-3">
          <h2 className="sm:col-span-3 text-sm font-semibold text-slate-900">Capacité</h2>
          <div>
            <label className="label-field" htmlFor="capacity">
              Voyageurs
            </label>
            <input
              id="capacity"
              type="number"
              min={1}
              className="input-field"
              value={form.capacity}
              onChange={(e) => setField('capacity', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label-field" htmlFor="bedrooms">
              Chambres
            </label>
            <input
              id="bedrooms"
              type="number"
              min={0}
              className="input-field"
              value={form.bedrooms}
              onChange={(e) => setField('bedrooms', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label-field" htmlFor="bathrooms">
              Salles de bain
            </label>
            <input
              id="bathrooms"
              type="number"
              min={0}
              step={0.5}
              className="input-field"
              value={form.bathrooms}
              onChange={(e) => setField('bathrooms', Number(e.target.value))}
            />
          </div>
        </section>

        <section className="panel grid gap-4 sm:grid-cols-2">
          <h2 className="sm:col-span-2 text-sm font-semibold text-slate-900">Tarifs & horaires</h2>
          <div>
            <label className="label-field" htmlFor="basePrice">
              Prix de base / nuit (€)
            </label>
            <input
              id="basePrice"
              type="number"
              min={0}
              className="input-field"
              value={form.basePrice}
              onChange={(e) => setField('basePrice', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label-field" htmlFor="touristTax">
              Taxe de séjour (€)
            </label>
            <input
              id="touristTax"
              type="number"
              min={0}
              className="input-field"
              value={form.touristTax ?? 0}
              onChange={(e) => setField('touristTax', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label-field" htmlFor="deposit">
              Caution (€)
            </label>
            <input
              id="deposit"
              type="number"
              min={0}
              className="input-field"
              value={form.deposit ?? 0}
              onChange={(e) => setField('deposit', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label-field" htmlFor="checkInTime">
              Heure d&apos;arrivée
            </label>
            <input
              id="checkInTime"
              type="time"
              className="input-field"
              value={form.checkInTime}
              onChange={(e) => setField('checkInTime', e.target.value)}
            />
          </div>
          <div>
            <label className="label-field" htmlFor="checkOutTime">
              Heure de départ
            </label>
            <input
              id="checkOutTime"
              type="time"
              className="input-field"
              value={form.checkOutTime}
              onChange={(e) => setField('checkOutTime', e.target.value)}
            />
          </div>
        </section>

        <section className="panel">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Équipements</h2>
          <div className="flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map((a) => {
              const active = amenities.includes(a);
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAmenity(a)}
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium ${
                    active
                      ? 'border-brand-700 bg-brand-50 text-brand-800'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  {a}
                </button>
              );
            })}
          </div>
          <div className="mt-4">
            <label className="label-field" htmlFor="amenitiesNotes">
              Notes équipements
            </label>
            <textarea
              id="amenitiesNotes"
              rows={2}
              className="input-field"
              value={form.amenitiesNotes}
              onChange={(e) => setField('amenitiesNotes', e.target.value)}
            />
          </div>
        </section>

        <section className="panel grid gap-4 sm:grid-cols-2">
          <h2 className="sm:col-span-2 text-sm font-semibold text-slate-900">Médias</h2>
          <div>
            <label className="label-field" htmlFor="photoUrls">
              URLs photos (une par ligne)
            </label>
            <textarea
              id="photoUrls"
              rows={4}
              className="input-field font-mono text-xs"
              value={form.photoUrls}
              onChange={(e) => setField('photoUrls', e.target.value)}
              placeholder="https://…"
            />
          </div>
          <div>
            <label className="label-field" htmlFor="videoUrls">
              URLs vidéos (une par ligne)
            </label>
            <textarea
              id="videoUrls"
              rows={4}
              className="input-field font-mono text-xs"
              value={form.videoUrls}
              onChange={(e) => setField('videoUrls', e.target.value)}
              placeholder="https://…"
            />
          </div>
        </section>

        <section className="panel grid gap-4">
          <h2 className="text-sm font-semibold text-slate-900">Règles & guide</h2>
          <div>
            <label className="label-field" htmlFor="houseRules">
              Règlement intérieur
            </label>
            <textarea
              id="houseRules"
              rows={3}
              className="input-field"
              value={form.houseRules}
              onChange={(e) => setField('houseRules', e.target.value)}
            />
          </div>
          <div>
            <label className="label-field" htmlFor="digitalGuide">
              Guide digital (markdown)
            </label>
            <textarea
              id="digitalGuide"
              rows={4}
              className="input-field"
              value={form.digitalGuide}
              onChange={(e) => setField('digitalGuide', e.target.value)}
            />
          </div>
        </section>

        {saveError ? <p className="text-sm text-amber-700">{saveError}</p> : null}

        <div className="flex gap-2">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Enregistrement…' : isEdit ? 'Mettre à jour' : 'Créer le logement'}
          </button>
        </div>
      </form>
    </div>
  );
}
