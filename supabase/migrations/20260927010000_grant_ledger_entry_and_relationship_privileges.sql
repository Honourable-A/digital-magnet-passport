-- ledger_entry and mr_relationship were created directly via the FastAPI app's raw
-- Postgres connection (SQLAlchemy create_all), not through Supabase's own
-- migration/dashboard tooling — so they never received the standard Supabase role
-- grants that `passport` has (confirmed via information_schema.role_table_grants:
-- these tables only had the default REFERENCES/TRIGGER/TRUNCATE privileges, missing
-- SELECT/INSERT/UPDATE/DELETE entirely for anon/authenticated/service_role). RLS
-- policies only take effect once a basic GRANT already permits the statement type;
-- without this, every access attempt fails with "permission denied for table" before
-- RLS is even consulted — including from the service role used by Edge Functions.

grant select, update on ledger_entry to authenticated;
grant select, insert, update on ledger_entry to service_role;

grant select, insert, delete on mr_relationship to authenticated;
grant select, insert, delete on mr_relationship to service_role;
