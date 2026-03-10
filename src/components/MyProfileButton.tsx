import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

export default function MyProfileButton() {
  const { user } = useAuth();
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('partner_profiles')
          .select('slug')
          .eq('user_id', user.id)
          .maybeSingle();
        if (error) throw error;
        if (!mounted) return;
        setSlug((data as any)?.slug ?? null);
      } catch {
        if (!mounted) return;
        setSlug(null);
      }
    }
    const reload = () => void load();
    window.addEventListener('partner-profile:changed', reload);
    void load();
    return () => {
      mounted = false;
      window.removeEventListener('partner-profile:changed', reload);
    };
  }, [user]);

  const href = useMemo(() => {
    if (!user) return null;
    if (slug) return `/conciergerie/${slug}`;
    return '/espace-partenaire';
  }, [user, slug]);

  if (!href) return null;

  return (
    <Button
      asChild
      variant="outline"
      className="shadow-lg hover:shadow-xl transition-all border-gray-200 text-gray-800 hover:bg-gray-100"
    >
      <Link to={href}>Ma fiche</Link>
    </Button>
  );
}

