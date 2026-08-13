"use client";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  type Node,
  type Edge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { useMemo } from "react";
import dagre from "dagre";


interface Props {
  passport?: any;
  lineage: any[];
  supplyChain: any[];
}


const nodeWidth = 180;
const nodeHeight = 50;



function applyDagreLayout(
  nodes: Node[],
  edges: Edge[]
) {

  const graph = new dagre.graphlib.Graph();

  graph.setDefaultEdgeLabel(
    () => ({})
  );


  graph.setGraph({
    rankdir:"LR",
    nodesep:120,
    ranksep:200,
  });



  nodes.forEach((node)=>{

    graph.setNode(
      node.id,
      {
        width:nodeWidth,
        height:nodeHeight,
      }
    );

  });



  edges.forEach((edge)=>{

    graph.setEdge(
      edge.source,
      edge.target
    );

  });



  dagre.layout(graph);



  return nodes.map((node)=>{

    const position =
      graph.node(node.id);



    return {

      ...node,

      position:{
        x:
          position.x -
          nodeWidth / 2,

        y:
          position.y -
          nodeHeight / 2,
      }

    };

  });

}




export default function PassportProvenanceGraph({
  passport,
  lineage,
  supplyChain,
}:Props){



const relevantSupply =
useMemo(()=>{

  if(!passport)
    return [];


  return supplyChain.filter(
    (edge)=>
      edge.passport_id === passport.id ||
      edge.passport_id === null
  );


},[
  supplyChain,
  passport
]);





const {nodes,edges}=useMemo(()=>{


const nodesMap =
new Map<string,Node>();


const edgesList:Edge[]=[];




/*
 SUPPLY CHAIN
*/


relevantSupply.forEach(
(item,index)=>{


if(
 !item.source ||
 !item.target
)
return;



const sourceId =
`company-${item.source.id}`;


const targetId =
`company-${item.target.id}`;




if(!nodesMap.has(sourceId)){


nodesMap.set(
sourceId,
{

id:sourceId,

position:{
x:0,
y:0
},

data:{
label:item.source.name
},


style:{
padding:12,
borderRadius:8,
border:"1px solid #999"
}

}

);

}




if(!nodesMap.has(targetId)){


nodesMap.set(
targetId,
{

id:targetId,

position:{
x:0,
y:0
},

data:{
label:item.target.name
},


style:{
padding:12,
borderRadius:8,
border:"1px solid #999"
}

}

);

}





edgesList.push({

id:
`supply-${item.id}-${index}`,

source:sourceId,

target:targetId,

label:item.relationship_type,

markerEnd:{
type:MarkerType.ArrowClosed
}

});


});







/*
 PASSPORT LINEAGE
*/


lineage.forEach(
(item,index)=>{


if(
 !item.source ||
 !item.target
)
return;



const sourceId =
`passport-${item.source.id}`;


const targetId =
`passport-${item.target.id}`;




const isSourceSelected =
item.source.id === passport?.id;


const isTargetSelected =
item.target.id === passport?.id;



if(!nodesMap.has(sourceId)){


nodesMap.set(
sourceId,
{

id:sourceId,

position:{
x:0,
y:0
},


data:{
label:item.source.passport_id
},


style:{

padding:12,

borderRadius:8,

border:
isSourceSelected
?
"3px solid black"
:
"1px solid #999",


background:
isSourceSelected
?
"#e5e7eb"
:
"#fff",


fontWeight:
isSourceSelected
?
"bold"
:
"normal"

}

}

);

}





if(!nodesMap.has(targetId)){


nodesMap.set(
targetId,
{

id:targetId,

position:{
x:0,
y:0
},


data:{
label:item.target.passport_id
},


style:{

padding:12,

borderRadius:8,

border:
isTargetSelected
?
"3px solid black"
:
"1px solid #999",


background:
isTargetSelected
?
"#e5e7eb"
:
"#fff",


fontWeight:
isTargetSelected
?
"bold"
:
"normal"

}

}

);

}





edgesList.push({

id:
`lineage-${item.id}-${index}`,


source:sourceId,


target:targetId,


label:item.relationship_type,


animated:
isSourceSelected ||
isTargetSelected,


markerEnd:{
type:MarkerType.ArrowClosed
},


style:{

strokeWidth:
isSourceSelected ||
isTargetSelected
?
3
:
1

}

});


});







const arrangedNodes =
applyDagreLayout(
Array.from(
nodesMap.values()
),
edgesList
);



return {

nodes:arrangedNodes,

edges:edgesList

};



},[
lineage,
relevantSupply,
passport
]);


if(nodes.length === 0){

return (
<div className="flex h-[500px] items-center justify-center rounded-lg border text-muted-foreground">

No provenance records available for this passport.

</div>
);

}



return (

<div className="w-full h-[80vh] border rounded-lg">


<ReactFlow

nodes={nodes}

edges={edges}

fitView

onlyRenderVisibleElements

>


<Background/>

<Controls/>

<MiniMap/>


</ReactFlow>


</div>

);

}