import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { addCleaning, addProperty, saveProfile, seedDemoData } from '../storage';

const steps = ['Votre conciergerie', 'Premier logement', 'Premier ménage', 'Terminé'];

export default function PmsOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [icalUrl, setIcalUrl] = useState('');
  const [cleaningDate, setCleaningDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('Turnover après check-out');
  const [createdPropertyId, setCreatedPropertyId] = useState<string | null>(null);

  const canNext = useMemo(() => {
    if (step === 0) return businessName.trim().length >= 2 && email.includes('@');
    if (step === 1) return propertyName.trim().length >= 2 && propertyAddress.trim().length >= 3;
    if (step === 2) return Boolean(cleaningDate);
    return true;
  }, [step, businessName, email, propertyName, propertyAddress, cleaningDate]);

  const finishWithDemoSeed = () => {
    saveProfile({
      businessName: businessName.trim() || 'Ma Conciergerie Demo',
      email: email.trim() || 'demo@cleanbnb.app',
      onboarded: true,
      onboardedAt: new Date().toISOString(),
    });
    seedDemoData();
    navigate('/pms/dashboard');
  };

  const goNext = () => {
    if (step === 0) {
      saveProfile({
        businessName: businessName.trim(),
        email: email.trim(),
        onboarded: false,
      });
      setStep(1);
      return;
    }

    if (step === 1) {
      const property = addProperty({
        name: propertyName.trim(),
        address: propertyAddress.trim(),
        icalUrl: icalUrl.trim(),
      });
      setCreatedPropertyId(property.id);
      setStep(2);
      return;
    }

    if (step === 2) {
      addCleaning({
        propertyId: createdPropertyId || 'unknown',
        propertyName: propertyName.trim() || 'Logement',
        cleaningDate,
        status: 'pending',
        notes: notes.trim(),
      });
      saveProfile({
        businessName: businessName.trim(),
        email: email.trim(),
        onboarded: true,
        onboardedAt: new Date().toISOString(),
      });
      setStep(3);
      return;
    }

    navigate('/pms/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/pms">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour présentation
          </Link>
        </Button>

        <Card>
          <CardContent className="p-6 sm:p-8">
            <p className="text-sm font-medium text-[#114c09] mb-2">Onboarding Cleanbnb PMS</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Configurez votre espace en quelques étapes</h1>

            <div className="flex flex-wrap gap-2 mb-8">
              {steps.map((label, index) => (
                <div
                  key={label}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    index === step
                      ? 'bg-[#114c09] text-white'
                      : index < step
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {index < step ? <Check className="w-3 h-3 inline mr-1" /> : null}
                  {index + 1}. {label}
                </div>
              ))}
            </div>

            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="business">Nom de la conciergerie</Label>
                  <Input
                    id="business"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="AppartCosy Conciergerie"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@conciergerie.fr"
                    className="mt-1.5"
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pname">Nom du logement</Label>
                  <Input
                    id="pname"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    placeholder="Loft centre-ville"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="paddr">Adresse</Label>
                  <Input
                    id="paddr"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    placeholder="20 rue Baudin, 02100 Saint-Quentin"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="ical">URL iCal Airbnb (optionnel)</Label>
                  <Input
                    id="ical"
                    value={icalUrl}
                    onChange={(e) => setIcalUrl(e.target.value)}
                    placeholder="https://www.airbnb.fr/calendar/ical/...."
                    className="mt-1.5"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cdate">Date du ménage</Label>
                  <Input
                    id="cdate"
                    type="date"
                    value={cleaningDate}
                    onChange={(e) => setCleaningDate(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold mb-2">Votre PMS est prêt</h2>
                <p className="text-gray-600 mb-4">
                  Accédez au dashboard pour gérer propriétés et ménages. Vous pourrez aussi charger des données démo.
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-between">
              <Button
                variant="outline"
                disabled={step === 0 || step === 3}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Retour
              </Button>
              <div className="flex flex-col sm:flex-row gap-2">
                {step < 3 && (
                  <Button variant="ghost" onClick={finishWithDemoSeed}>
                    Remplir avec une démo complète
                  </Button>
                )}
                <Button
                  className="bg-[#114c09] hover:bg-[#0c3a07]"
                  disabled={step < 3 && !canNext}
                  onClick={goNext}
                >
                  {step === 3 ? 'Aller au dashboard' : 'Continuer'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
