export interface SupplyChainNode {
  id: string;
  company: string;
  stage: string;
  stageLabel: string;
  country: string | null;
  publicPrivate: string | null;
  ticker: string | null;
  inAnchorRegister: boolean;
  hasSplcEdges: boolean;
  source: string | null;
}

export interface SupplyChainEdge {
  id: string;
  sourceCompany: string;
  targetCompany: string;
  anchorFirm: string;
  relationship: string;
  relevance: "ANCHOR" | "HIGH" | "POSSIBLE";
  stage: string | null;
  country: string | null;
  industry: string | null;
  revenueSupplierPercent: string | null;
  costPercent: string | null;
  assessmentNotes: string | null;
}

export interface SupplyChainData {
  metadata: {
    sourceFile: string;
    nodeCount: number;
    edgeCount: number;
  };
  nodes: SupplyChainNode[];
  edges: SupplyChainEdge[];
}