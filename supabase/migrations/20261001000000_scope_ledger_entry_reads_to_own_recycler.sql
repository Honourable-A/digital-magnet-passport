-- ledger_entry's SELECT policy let any authenticated RECYCLER read every recycler's
-- submissions for a passport, not just their own. That's the same category of leak
-- as the Composition tab's "exact" disclosure for Recyclers — the ZKP flow exists so
-- a Recycler only learns the outcome of their own threshold claim, not what other
-- parties have submitted. AUDITOR/ADMIN still need full visibility for aggregation
-- and oversight, so only the RECYCLER policy is scoped down.

drop policy "recycler/auditor/admin can read ledger entries" on ledger_entry;

create policy "recycler can read own ledger entries"
on ledger_entry for select
to authenticated
using (
  upper(auth.jwt() -> 'user_metadata' ->> 'role') = 'RECYCLER'
  and recycler_uid = auth.uid()::text
);

create policy "auditor/admin can read all ledger entries"
on ledger_entry for select
to authenticated
using (
  upper(auth.jwt() -> 'user_metadata' ->> 'role') in ('AUDITOR', 'ADMIN')
);
