from fastapi import APIRouter, Depends, HTTPException
from neo4j import Session as GraphSession
from pydantic import BaseModel
from typing import Optional
from app.graph import get_graph

router = APIRouter()

NODE_LABELS = {"Company", "Passport", "Material", "Certificate", "Audit"}
EDGE_TYPES = {"SUPPLIES", "PRODUCES", "OWNS", "RECYCLES", "CERTIFIES"}


class NodeCreate(BaseModel):
    label: str
    name: str
    properties: Optional[dict] = {}

class EdgeCreate(BaseModel):
    source_name: str
    source_label: str
    target_name: str
    target_label: str
    relationship: str


@router.post("/graph/node", status_code=201)
def create_node(data: NodeCreate, graph: GraphSession = Depends(get_graph)):
    if data.label not in NODE_LABELS:
        raise HTTPException(status_code=400, detail=f"Invalid label. Must be one of {NODE_LABELS}")
    props = {**data.properties, "name": data.name}
    query = f"MERGE (n:{data.label} {{name: $name}}) SET n += $props RETURN n"
    result = graph.run(query, name=data.name, props=props).single()
    return {"node": dict(result["n"])}

@router.post("/graph/edge", status_code=201)
def create_edge(data: EdgeCreate, graph: GraphSession = Depends(get_graph)):
    if data.relationship not in EDGE_TYPES:
        raise HTTPException(status_code=400, detail=f"Invalid relationship. Must be one of {EDGE_TYPES}")
    query = (
        f"MATCH (a:{data.source_label} {{name: $src}}), (b:{data.target_label} {{name: $tgt}}) "
        f"MERGE (a)-[r:{data.relationship}]->(b) "
        f"RETURN a.name AS source, type(r) AS rel, b.name AS target"
    )
    record = graph.run(query, src=data.source_name, tgt=data.target_name).single()
    if not record:
        raise HTTPException(status_code=404, detail="One or both nodes not found")
    return {"source": record["source"], "relationship": record["rel"], "target": record["target"]}

@router.get("/graph/provenance/{company_name}")
def get_provenance(company_name: str, graph: GraphSession = Depends(get_graph)):
    query = (
        "MATCH path = (start:Company {name: $name})-[:SUPPLIES*]->(end:Company) "
        "WHERE NOT (end)-[:SUPPLIES]->() "
        "RETURN [n IN nodes(path) | n.name] AS chain"
    )
    record = graph.run(query, name=company_name).single()
    if not record:
        return {"path": [company_name]}
    return {"path": record["chain"]}

@router.get("/graph/neighbors/{company_name}")
def get_neighbors(company_name: str, graph: GraphSession = Depends(get_graph)):
    query = (
        "MATCH (a:Company {name: $name})-[r]-(b) "
        "RETURN b.name AS name, labels(b)[0] AS label, type(r) AS relationship, "
        "CASE WHEN startNode(r) = a THEN 'outgoing' ELSE 'incoming' END AS direction"
    )
    results = graph.run(query, name=company_name).data()
    return {"neighbors": results}
