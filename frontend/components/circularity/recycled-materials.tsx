"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getRecycledMaterials,
  RecycledMaterialPassport,
} from "@/lib/api/circularity";


export default function RecycledMaterials({
  passportId,
}: {
  passportId:number;
}) {


const [
materials,
setMaterials
] = useState<RecycledMaterialPassport[]>([]);


const [
loading,
setLoading
] = useState(true);



useEffect(()=>{

async function loadMaterials(){

try{

const data =
await getRecycledMaterials(
passportId
);


console.log(
"RECYCLED MATERIALS:",
data
);


setMaterials(
data
);


}
catch(error){

console.error(
"RECYCLED MATERIAL ERROR:",
error
);


setMaterials([]);

}
finally{

setLoading(false);

}

}


loadMaterials();


},[passportId]);



if(loading){

return (

<p className="text-sm text-muted-foreground">
Loading recycled material data...
</p>

);

}



if(materials.length===0){

return (

<div className="rounded-lg border p-4">

<p className="text-sm text-muted-foreground">
No recycled material passport available.
</p>

</div>

);

}



return (

<div className="space-y-4">


<h3 className="font-semibold">
Recovered Material Passports
</h3>



<div className="grid gap-4 md:grid-cols-2">


{
materials.map(
(material)=>(

<div
key={material.id}
className="rounded-lg border p-4"
>


<p className="font-semibold">
{material.material_type}
</p>



<div className="mt-2 space-y-1 text-sm">


<p>
Quantity:
{" "}
<span className="font-medium">

{
material.quantity !== null &&
material.quantity !== undefined
?
`${material.quantity} kg`
:
"Not available"
}

</span>
</p>



<p className="text-muted-foreground">

Source Passport:
{" "}
{material.source_passport_id}

</p>



</div>


</div>

)

)

}


</div>


</div>

);

}