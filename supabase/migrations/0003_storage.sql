-- =====================================================================
-- Storage: public `item-images` bucket + policies.
-- Public read (catalog images), admin-only write/delete.
-- =====================================================================

insert into storage.buckets (id, name, public)
values ('item-images', 'item-images', true)
on conflict (id) do nothing;

-- Public read of objects in the bucket.
create policy "item_images_public_read"
  on storage.objects for select
  using (bucket_id = 'item-images');

-- Admin (owner/manager) may upload.
create policy "item_images_admin_insert"
  on storage.objects for insert
  with check (bucket_id = 'item-images' and is_admin());

-- Admin may update (e.g. upsert).
create policy "item_images_admin_update"
  on storage.objects for update
  using (bucket_id = 'item-images' and is_admin())
  with check (bucket_id = 'item-images' and is_admin());

-- Admin may delete.
create policy "item_images_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'item-images' and is_admin());
