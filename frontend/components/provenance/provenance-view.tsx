import ProvenanceTab from "./provenance-tab";
import { getProvenance } from "@/lib/api/provenance";

interface Props {
  passportId: string | number;
}

export default async function ProvenanceView({
  passportId,
}: Props) {
  const response = await getProvenance(passportId);

  console.log("PROVENANCE RESPONSE:", response);

  const provenance = response.path ?? [];

  return (
    <ProvenanceTab
      passportId={String(passportId)}
      provenance={provenance}
    />
  );
}