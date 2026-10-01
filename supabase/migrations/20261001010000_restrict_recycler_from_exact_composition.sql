-- The actual Composition tab (frontend/components/Composition.tsx) queries
-- passport_material directly and renders every column verbatim — it relies entirely
-- on RLS for access control, not any client-side role check. Its own "restricted"
-- messaging ("Privacy-preserving verification allows compliance checks without
-- exposing commercially sensitive composition data") makes clear this was always
-- meant to block Recycler, but the policy allowed every role through unconditionally.
--
-- (A separate, parallel composition-disclosure component/access-policy.ts module
-- exists with "exact"/"range"/"presence" levels, but is not actually wired into the
-- passport page — it was already fixed to stop granting Recycler "exact" for when/if
-- it is wired in, but that alone had no effect on what users actually see today.)

drop policy "passport material role access" on passport_material;

create policy "passport material role access"
on passport_material for select
to authenticated
using (
  (auth.jwt() -> 'user_metadata' ->> 'role') = any (array['Manufacturer', 'Auditor', 'Regulator', 'Admin'])
);
