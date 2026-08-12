import ProvenanceView from "@/components/provenance/provenance-view";


export default async function ProvenancePage(){

  const passportId = "1";


  return (
    <ProvenanceView
      passportId={passportId}
    />
  );
}