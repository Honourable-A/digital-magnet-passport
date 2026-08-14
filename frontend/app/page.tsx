import { ProvenanceTimeline } from "@/components/provenance/provenance-timeline";
import { SupplyChainGraph } from "@/components/provenance/supply-chain-graph";

export default function ProvenancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Provenance Explorer
        </h1>

        <p className="mt-1 text-muted-foreground">
          Explore the magnet supply chain from S1 mining to S6 recycling.
        </p>
      </div>

      <ProvenanceTimeline />

      <SupplyChainGraph />
    </div>
  );
}