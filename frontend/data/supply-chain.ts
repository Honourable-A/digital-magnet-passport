import networkData from "@/data/supply-chain.json";

import type { SupplyChainData } from "@/types/supply-chain";

export const supplyChainData = networkData as SupplyChainData;

export const supplyChainNodes = supplyChainData.nodes;

export const supplyChainEdges = supplyChainData.edges;