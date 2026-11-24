-- ============================================================
-- CORRECTION COMPLÈTE DE LA SÉCURITÉ SUPABASE
-- Projet: Conciergeries (huiqcanmoadmjostyubj)
-- Date: 24 novembre 2026
-- ============================================================
-- 
-- Ce script active Row Level Security (RLS) sur TOUTES les tables
-- et crée des politiques de sécurité appropriées
--
-- ⚠️  À exécuter dans le SQL Editor de Supabase
-- ============================================================

-- 1. ACTIVER RLS SUR TOUTES LES TABLES PUBLIQUES
-- ============================================================

-- Table partner_profiles (Profils des conciergeries partenaires)
ALTER TABLE IF EXISTS public.partner_profiles ENABLE ROW LEVEL SECURITY;

-- Table users (Utilisateurs)
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;

-- Table profiles (Profils utilisateurs)
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- Table leads (Demandes de devis)
ALTER TABLE IF EXISTS public.leads ENABLE ROW LEVEL SECURITY;

-- Toutes les autres tables publiques
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        AND tablename NOT IN ('spatial_ref_sys') -- Exclure les tables système
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
    END LOOP;
END $$;

-- 2. POLITIQUES POUR partner_profiles (Profils conciergeries)
-- ============================================================

-- Lecture publique: Tout le monde peut voir les profils publiés
DROP POLICY IF EXISTS "Public can view published profiles" ON public.partner_profiles;
CREATE POLICY "Public can view published profiles"
ON public.partner_profiles
FOR SELECT
TO anon, authenticated
USING (true); -- Tous les profils sont visibles (c'est un annuaire public)

-- Création: Seuls les utilisateurs authentifiés peuvent créer leur profil
DROP POLICY IF EXISTS "Users can create own profile" ON public.partner_profiles;
CREATE POLICY "Users can create own profile"
ON public.partner_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Mise à jour: Les utilisateurs peuvent modifier leur propre profil
DROP POLICY IF EXISTS "Users can update own profile" ON public.partner_profiles;
CREATE POLICY "Users can update own profile"
ON public.partner_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Suppression: Les utilisateurs peuvent supprimer leur propre profil
DROP POLICY IF EXISTS "Users can delete own profile" ON public.partner_profiles;
CREATE POLICY "Users can delete own profile"
ON public.partner_profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 3. POLITIQUES POUR users (Utilisateurs)
-- ============================================================

-- Lecture: Les utilisateurs peuvent lire leur propre profil
DROP POLICY IF EXISTS "Users can view own user" ON public.users;
CREATE POLICY "Users can view own user"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Mise à jour: Les utilisateurs peuvent modifier leur propre profil
DROP POLICY IF EXISTS "Users can update own user" ON public.users;
CREATE POLICY "Users can update own user"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Insertion: Lors de l'inscription
DROP POLICY IF EXISTS "Users can insert own user" ON public.users;
CREATE POLICY "Users can insert own user"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 4. POLITIQUES POUR profiles (Profils utilisateurs)
-- ============================================================

-- Lecture: Les utilisateurs peuvent lire leur propre profil
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Mise à jour: Les utilisateurs peuvent modifier leur propre profil
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Insertion: Lors de l'inscription
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 5. POLITIQUES POUR leads (Demandes de devis)
-- ============================================================

-- Insertion: Tout le monde peut envoyer une demande de devis (formulaire public)
DROP POLICY IF EXISTS "Anyone can create leads" ON public.leads;
CREATE POLICY "Anyone can create leads"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Lecture: Seuls les conciergeries et admins peuvent voir les leads
DROP POLICY IF EXISTS "Partners can view their leads" ON public.leads;
CREATE POLICY "Partners can view their leads"
ON public.leads
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.partner_profiles
        WHERE user_id = auth.uid()
    )
);

-- 6. VÉRIFICATIONS FINALES
-- ============================================================

-- Vérifier que RLS est activé sur toutes les tables
SELECT 
    schemaname,
    tablename,
    rowsecurity AS "RLS Activé"
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename NOT IN ('spatial_ref_sys')
ORDER BY tablename;

-- Lister toutes les politiques créées
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================
-- ✅ SCRIPT TERMINÉ
-- ============================================================
-- 
-- Vérifications à faire après l'exécution:
-- 1. Retourner sur le Security Advisor de Supabase
-- 2. Cliquer sur "Refresh"
-- 3. L'erreur "Tableau accessible au public" doit avoir disparu
-- 4. Tester que votre application fonctionne toujours correctement
--
-- Si des problèmes apparaissent:
-- - Vérifier que les utilisateurs sont bien authentifiés
-- - Ajuster les politiques selon vos besoins spécifiques
-- ============================================================
