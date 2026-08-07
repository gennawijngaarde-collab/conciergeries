import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

const BUCKET = 'partner-logos';
const MAX_BYTES = 2 * 1024 * 1024; // 2 Mo
const ALLOWED = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']);

export function validateLogoFile(file: File): string | null {
  if (!ALLOWED.has(file.type)) {
    return 'Formats acceptés : PNG, JPG, WEBP ou SVG.';
  }
  if (file.size > MAX_BYTES) {
    return 'Le fichier doit faire moins de 2 Mo.';
  }
  return null;
}

/**
 * Upload un logo partenaire dans le bucket public `partner-logos`.
 * Chemin : {userId}/logo-{timestamp}.{ext}
 */
export async function uploadPartnerLogo(userId: string, file: File): Promise<string> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase n’est pas configuré. Impossible d’uploader le logo.');
  }

  const err = validateLogoFile(file);
  if (err) throw new Error(err);

  const ext =
    file.type === 'image/svg+xml'
      ? 'svg'
      : file.type === 'image/png'
        ? 'png'
        : file.type === 'image/webp'
          ? 'webp'
          : 'jpg';

  const path = `${userId}/logo-${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type,
  });

  if (error) {
    throw new Error(
      error.message.includes('Bucket not found')
        ? 'Bucket partner-logos manquant. Exécutez supabase/partner_logos_storage.sql dans Supabase.'
        : error.message
    );
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) throw new Error('Impossible d’obtenir l’URL publique du logo.');
  return data.publicUrl;
}
