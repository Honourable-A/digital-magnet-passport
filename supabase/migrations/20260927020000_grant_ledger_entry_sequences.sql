-- Table-level INSERT doesn't imply sequence USAGE — the serial `id` columns on
-- these tables need their backing sequences granted separately, same root cause as
-- the previous migration (created outside Supabase's own tooling, so never got the
-- usual default grants).

grant usage, select on sequence ledger_entry_id_seq to service_role;
grant usage, select on sequence mr_relationship_id_seq to authenticated, service_role;
