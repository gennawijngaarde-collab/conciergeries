import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  addCleaning,
  getCleanings,
  getProfile,
  getProperties,
  updateCleaningStatus,
} from '../storage';
import type { PmsCleaningStatus } from '../types';

const statuses: PmsCleaningStatus[] = ['pending', 'in_progress', 'done', 'cancelled'];

export default function PmsCleanings() {
  const profile = getProfile();
  const properties = getProperties();
  const [cleanings, setCleanings] = useState(() => getCleanings());
  const [propertyId, setPropertyId] = useState(() => getProperties()[0]?.id || '');
  const [cleaningDate, setCleaningDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [filter, setFilter] = useState<'all' | PmsCleaningStatus>('all');

  const filtered = useMemo(
    () => (filter === 'all' ? cleanings : cleanings.filter((c) => c.status === filter)),
    [cleanings, filter]
  );

  if (!profile?.onboarded) return <Navigate to="/pms/onboarding" replace />;

  const refresh = () => setCleanings(getCleanings());

  const onAdd = () => {
    const property = properties.find((p) => p.id === propertyId);
    if (!property) return;
    addCleaning({
      propertyId: property.id,
      propertyName: property.name,
      cleaningDate,
      status: 'pending',
      notes,
    });
    setNotes('');
    refresh();
  };

  const onStatus = (id: string, status: PmsCleaningStatus) => {
    updateCleaningStatus(id, status);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ménages</h1>
        <p className="text-sm text-gray-600">Planifiez et suivez les turnovers</p>
      </div>

      <Card>
        <CardContent className="p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label>Logement</Label>
            <select
              className="mt-1.5 w-full h-10 rounded-md border px-3 text-sm"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              className="mt-1.5"
              value={cleaningDate}
              onChange={(e) => setCleaningDate(e.target.value)}
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Input className="mt-1.5" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button className="w-full bg-[#114c09] hover:bg-[#0c3a07]" onClick={onAdd} disabled={!propertyId}>
              Ajouter un ménage
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {(['all', ...statuses] as const).map((s) => (
          <Button
            key={s}
            size="sm"
            variant={filter === s ? 'default' : 'outline'}
            className={filter === s ? 'bg-[#114c09] hover:bg-[#0c3a07]' : ''}
            onClick={() => setFilter(s)}
          >
            {s}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-medium">{c.propertyName}</p>
                <p className="text-sm text-gray-500">
                  {c.cleaningDate} · {c.notes || 'Sans note'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{c.status}</Badge>
                {statuses.map((s) => (
                  <Button key={s} size="sm" variant="outline" onClick={() => onStatus(c.id, s)}>
                    {s}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-sm text-gray-500">Aucun ménage pour ce filtre.</p>}
      </div>
    </div>
  );
}
