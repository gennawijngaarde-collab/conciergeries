-- Logo upload for partners (run in Supabase SQL Editor).
-- Bucket public + policies : lecture publique, écriture limitée au dossier de l'utilisateur.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'partner-logos',
  'partner-logos',
  true,
  2097152,
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Lecture publique
drop policy if exists "partner_logos_public_read" on storage.objects;
create policy "partner_logos_public_read"
on storage.objects for select
to public
using (bucket_id = 'partner-logos');

-- Upload : dossier = auth.uid()
drop policy if exists "partner_logos_owner_insert" on storage.objects;
create policy "partner_logos_owner_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'partner-logos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "partner_logos_owner_update" on storage.objects;
create policy "partner_logos_owner_update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'partner-logos'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'partner-logos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "partner_logos_owner_delete" on storage.objects;
create policy "partner_logos_owner_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'partner-logos'
  and (storage.foldername(name))[1] = auth.uid()::text
);
