import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { addProperty, deleteProperty, getProfile, getProperties } from '../storage';

export default function PmsProperties() {
  const profile = getProfile();
  const [properties, setProperties] = useState(() => getProperties());
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [icalUrl, setIcalUrl] = useState('');
  const [open, setOpen] = useState(false);

  if (!profile?.onboarded) return <Navigate to="/pms/onboarding" replace />;

  const refresh = () => setProperties(getProperties());

  const onAdd = () => {
    if (!name.trim() || !address.trim()) return;
    addProperty({ name: name.trim(), address: address.trim(), icalUrl: icalUrl.trim() });
    setName('');
    setAddress('');
    setIcalUrl('');
    setOpen(false);
    refresh();
  };

  const onDelete = (id: string) => {
    deleteProperty(id);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Propriétés</h1>
          <p className="text-gray-600 text-sm">{properties.length} logement(s) dans Cleanbnb</p>
        </div>
        <Button className="bg-[#114c09] hover:bg-[#0c3a07]" onClick={() => setOpen((v) => !v)}>
          <Plus className="w-4 h-4 mr-1" />
          Ajouter
        </Button>
      </div>

      {open && (
        <Card>
          <CardContent className="p-5 grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Nom</Label>
              <Input className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Adresse</Label>
              <Input className="mt-1.5" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label>URL iCal</Label>
              <Input className="mt-1.5" value={icalUrl} onChange={(e) => setIcalUrl(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Button onClick={onAdd} className="bg-[#114c09] hover:bg-[#0c3a07]">
                Enregistrer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {properties.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{p.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">{p.address}</p>
                  {p.icalUrl && (
                    <p className="text-xs text-gray-400 mt-2 break-all">iCal : {p.icalUrl}</p>
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={() => onDelete(p.id)} aria-label="Supprimer">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
