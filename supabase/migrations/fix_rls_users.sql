-- Script SQL pour sécuriser la table users
-- À exécuter dans le SQL Editor de Supabase

-- 1. Activer Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Créer une politique pour la lecture (SELECT)
-- Les utilisateurs authentifiés peuvent lire leur propre profil
CREATE POLICY "Users can view own profile"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 3. Créer une politique pour la mise à jour (UPDATE)
-- Les utilisateurs authentifiés peuvent modifier leur propre profil
CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Optionnel: Permettre l'insertion lors de l'inscription
-- Seulement si vous utilisez l'auto-inscription
CREATE POLICY "Users can insert own profile on signup"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 5. Optionnel: Permettre aux admins de tout voir/modifier
-- Seulement si vous avez un rôle admin dans votre app
-- CREATE POLICY "Admins can view all users"
-- ON public.users
-- FOR ALL
-- TO authenticated
-- USING (
--   EXISTS (
--     SELECT 1 FROM public.user_roles
--     WHERE user_id = auth.uid()
--     AND role = 'admin'
--   )
-- );

-- Vérifier que RLS est bien activé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'users';

-- Lister les politiques créées
SELECT * FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'users';
