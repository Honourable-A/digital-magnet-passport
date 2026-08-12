"use client";

interface ProvenanceTabProps {
  passportId: string | number;
  provenance?: any[];
}


export default function ProvenanceTab({
  passportId,
}: ProvenanceTabProps) {


  return (
    <div className="w-full h-[80vh] rounded-lg overflow-hidden border">

      <iframe
        src={`/trace4magnet/map.html?passport=${passportId}`}
        title="TRACE4MAGNET Supply Chain"
        className="w-full h-full border-0"
      />

    </div>
  );
}