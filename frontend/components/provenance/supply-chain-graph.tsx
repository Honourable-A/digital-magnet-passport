"use client";

import { useMemo, useState } from "react";
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
  type NodeMouseHandler,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  supplyChainEdges,
  supplyChainNodes,
} from "@/data/supply-chain";
import type { SupplyChainNode } from "@/types/supply-chain";

type ProvenanceNodeData = Record<string, unknown> & {
  label: string;
  company: string;
  stage: string;
  stageLabel: string;
  country: string | null;
  inAnchorRegister: boolean;
};

type ProvenanceFlowNode = Node<ProvenanceNodeData>;

const stageOrder = ["S1", "S2", "S3", "S4", "S5", "S6"];

const stageLabels = [
  { stage: "S1", label: "Mining" },
  { stage: "S2", label: "Refining" },
  { stage: "S3", label: "Alloy" },
  { stage: "S4", label: "Magnet" },
  { stage: "S5", label: "Integration" },
  { stage: "S6", label: "Recycling" },
];

function createGraphNodes(): ProvenanceFlowNode[] {
  const visibleNodes = supplyChainNodes.filter(
    (node) => node.inAnchorRegister
  );

  return visibleNodes.map((node) => {
    const stageIndex = stageOrder.indexOf(node.stage);

    const nodesInStage = visibleNodes.filter(
      (item) => item.stage === node.stage
    );

    const nodeIndex = nodesInStage.findIndex(
      (item) => item.id === node.id
    );

    return {
      id: node.id,
      position: {
        x: Math.max(stageIndex, 0) * 300,
        y: nodeIndex * 100,
      },
      data: {
        label: node.company,
        company: node.company,
        stage: node.stage,
        stageLabel: node.stageLabel,
        country: node.country,
        inAnchorRegister: node.inAnchorRegister,
      },
      style: {
        width: 220,
        padding: 12,
        borderRadius: 8,
        border: "2px solid currentColor",
        fontSize: 12,
      },
    };
  });
}

function createGraphEdges(
  nodes: ProvenanceFlowNode[]
): Edge[] {
  const visibleNodeIds = new Set(
    nodes.map((node) => node.id)
  );

  const companyToNodeId = new Map(
    supplyChainNodes.map((node) => [
      node.company,
      node.id,
    ])
  );

  return supplyChainEdges.reduce<Edge[]>(
    (graphEdges, relationship) => {
      const sourceId = companyToNodeId.get(
        relationship.sourceCompany
      );

      const targetId = companyToNodeId.get(
        relationship.targetCompany
      );

      if (
        !sourceId ||
        !targetId ||
        !visibleNodeIds.has(sourceId) ||
        !visibleNodeIds.has(targetId)
      ) {
        return graphEdges;
      }

      graphEdges.push({
        id: relationship.id,
        source: sourceId,
        target: targetId,
        type: "smoothstep",
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: {
          strokeWidth: 1.5,
        },
      });

      return graphEdges;
    },
    []
  );
}

export function SupplyChainGraph() {
  const nodes = useMemo<ProvenanceFlowNode[]>(
    () => createGraphNodes(),
    []
  );

  const edges = useMemo<Edge[]>(
    () => createGraphEdges(nodes),
    [nodes]
  );

  const [selectedNode, setSelectedNode] =
    useState<SupplyChainNode | null>(null);

  const handleNodeClick: NodeMouseHandler<
    ProvenanceFlowNode
  > = (_event, node) => {
    const matchingNode = supplyChainNodes.find(
      (item) => item.id === node.id
    );

    setSelectedNode(matchingNode ?? null);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">
          This view displays anchor firms from the verified
          TRACE4MAGNET supply-chain dataset. Select a company
          node to inspect its stage and country.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {stageLabels.map(({ stage, label }) => (
              <div
                key={stage}
                className="rounded-lg border bg-muted/40 p-3 text-center"
              >
                <p className="font-semibold">{stage}</p>
                <p className="text-sm text-muted-foreground">
                  {label}
                </p>
              </div>
            ))}
          </div>

          <div className="h-[700px] w-full overflow-hidden rounded-lg border bg-background">
            <ReactFlow<ProvenanceFlowNode, Edge>
              nodes={nodes}
              edges={edges}
              onNodeClick={handleNodeClick}
              fitView
              fitViewOptions={{
                padding: 0.15,
                maxZoom: 0.9,
              }}
              minZoom={0.15}
              maxZoom={1.5}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable
            >
              <Background />
              <Controls />
              <MiniMap pannable zoomable />
            </ReactFlow>
          </div>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Node Details</CardTitle>
          </CardHeader>

          <CardContent>
            {selectedNode ? (
              <dl className="space-y-5">
                <div>
                  <dt className="text-sm text-muted-foreground">
                    Company
                  </dt>
                  <dd className="mt-1 font-medium">
                    {selectedNode.company}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-muted-foreground">
                    Stage
                  </dt>
                  <dd className="mt-1 font-medium">
                    {selectedNode.stage} ·{" "}
                    {selectedNode.stageLabel}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-muted-foreground">
                    Country
                  </dt>
                  <dd className="mt-1 font-medium">
                    {selectedNode.country ??
                      "Not available"}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-muted-foreground">
                    Anchor Firm
                  </dt>
                  <dd className="mt-1 font-medium">
                    {selectedNode.inAnchorRegister
                      ? "Yes"
                      : "No"}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-muted-foreground">
                    Public or Private
                  </dt>
                  <dd className="mt-1 font-medium">
                    {selectedNode.publicPrivate ??
                      "Not available"}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-muted-foreground">
                    Bloomberg Ticker
                  </dt>
                  <dd className="mt-1 font-medium">
                    {selectedNode.ticker ??
                      "Not available"}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a company node to view its
                supply-chain details.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}