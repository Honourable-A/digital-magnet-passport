-- Replace ledger_entry's integer peer_session FKs with supabase_uid text columns,
-- since peer discovery is moving to Realtime Presence (peer_session is no longer
-- the source of truth for who a peer is). Backfill from the existing peer_session
-- rows before dropping the old columns.

alter table ledger_entry
  add column manufacturer_uid varchar(36),
  add column recycler_uid varchar(36);

update ledger_entry le
set manufacturer_uid = ps.supabase_uid
from peer_session ps
where ps.id = le.manufacturer_id;

update ledger_entry le
set recycler_uid = ps.supabase_uid
from peer_session ps
where ps.id = le.recycler_id;

alter table ledger_entry
  alter column manufacturer_uid set not null,
  alter column recycler_uid set not null;

alter table ledger_entry
  drop column manufacturer_id,
  drop column recycler_id;

-- RLS policies. ledger_entry currently has RLS enabled with zero policies, meaning
-- it's completely inaccessible via the Supabase client (only the FastAPI service,
-- connecting as the postgres role, could read/write it). Inserts continue to go
-- through the submit-ledger Edge Function using the service role key (which bypasses
-- RLS) so it can re-verify the proof server-side before the row lands — no INSERT
-- policy is added here on purpose.

create policy "recycler/auditor/admin can read ledger entries"
on ledger_entry for select
to authenticated
using (
  upper(auth.jwt() -> 'user_metadata' ->> 'role') in ('RECYCLER', 'AUDITOR', 'ADMIN')
);

create policy "recycler can flag their own ledger entries as tampered"
on ledger_entry for update
to authenticated
using (
  upper(auth.jwt() -> 'user_metadata' ->> 'role') = 'RECYCLER'
  and recycler_uid = auth.uid()::text
)
with check (
  upper(auth.jwt() -> 'user_metadata' ->> 'role') = 'RECYCLER'
  and recycler_uid = auth.uid()::text
);

-- mr_relationship also has RLS enabled with zero policies today.

create policy "admin can read all relationships"
on mr_relationship for select
to authenticated
using (
  upper(auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
);

create policy "parties can read their own relationship"
on mr_relationship for select
to authenticated
using (
  manufacturer_uid = auth.uid()::text
  or recycler_uid = auth.uid()::text
);

create policy "admin can create relationships"
on mr_relationship for insert
to authenticated
with check (
  upper(auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
);

create policy "admin can delete relationships"
on mr_relationship for delete
to authenticated
using (
  upper(auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
);
