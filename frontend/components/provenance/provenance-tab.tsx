"use client";

import { useEffect, useState } from "react";
import PassportProvenanceGraph from "./passport-provenance-graph";

interface Props {
  passportId: string | number;
}

export default function ProvenanceTab({
  passportId,
}: Props) {

  const [provenance, setProvenance] = useState<any>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    async function loadProvenance() {

      try {

        const res = await fetch(
          `/api/provenance/${passportId}`
        );

        const data = await res.json();

        console.log(
          "PASSPORT PROVENANCE:",
          data
        );

        setProvenance(data);

      } catch(error) {

        console.error(
          "PROVENANCE LOAD ERROR:",
          error
        );

      } finally {

        setLoading(false);

      }

    }


    loadProvenance();

  }, [passportId]);



  if(loading){

    return (
      <p className="p-4 text-muted-foreground">
        Loading provenance...
      </p>
    );

  }



  if(!provenance){

    return (
      <p className="p-4 text-muted-foreground">
        No provenance data available.
      </p>
    );

  }



  return (

    <PassportProvenanceGraph

      passport={
        provenance.passport
      }

      lineage={
        provenance.lineage ?? []
      }

      supplyChain={
        provenance.supplyChain ?? []
      }

    />

  );

}