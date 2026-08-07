import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { uploadPartnerLogo, validateLogoFile } from '@/lib/uploadPartnerLogo';
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient';

type Props = {
  value: string;
  onChange: (url: string) => void;
  /** Si fourni, upload direct ; sinon on attend la session auth courante */
  userId?: string | null;
  disabled?: boolean;
};

/**
 * Saisie logo : upload fichier (Supabase Storage) et/ou URL manuelle.
 */
export default function PartnerLogoField({ value, onChange, userId, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);

    const validation = validateLogoFile(file);
    if (validation) {
      setError(validation);
      return;
    }

    setUploading(true);
    try {
      let uid = userId;
      if (!uid) {
        const { data } = await supabase.auth.getUser();
        uid = data.user?.id ?? null;
      }
      if (!uid) {
        // Pas encore connecté (ex. formulaire devenir-partenaire avant checkout) :
        // on convertit en data URL temporaire pour preview ; l’URL réelle sera
        // demandée après paiement via le dashboard, OU on stocke en data URL courte.
        // Pour le checkout metadata, on préfère demander de se connecter pour uploader
        // — sinon data URL trop longue pour Stripe metadata.
        if (!isSupabaseConfigured) {
          setError('Configurez Supabase pour uploader un logo, ou collez une URL.');
          return;
        }
        setError('Connectez-vous (ou collez une URL de logo) pour uploader un fichier.');
        return;
      }

      const publicUrl = await uploadPartnerLogo(uid, file);
      onChange(publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Échec de l’upload');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <div className="w-20 h-20 rounded-xl border bg-white flex items-center justify-center overflow-hidden shrink-0">
          {value ? (
            <img src={value} alt="Aperçu logo" className="w-16 h-16 object-contain" />
          ) : (
            <ImagePlus className="w-8 h-8 text-gray-300" />
          )}
        </div>
        <div className="flex-1 space-y-2 w-full">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={disabled || uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Upload…
                </>
              ) : (
                <>
                  <ImagePlus className="w-4 h-4 mr-2" />
                  Importer un logo
                </>
              )}
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              disabled={disabled || uploading}
              onChange={(e) => void handleFile(e.target.files?.[0])}
            />
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, WEBP ou SVG — max 2 Mo.</p>
        </div>
      </div>

      <div className="relative">
        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={value}
          onChange={(e) => {
            setError(null);
            onChange(e.target.value);
          }}
          disabled={disabled || uploading}
          placeholder="ou collez une URL https://…/logo.png"
          className="pl-9"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
