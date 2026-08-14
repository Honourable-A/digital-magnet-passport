"use client";

import {
useEffect,
useState
} from "react";

import {
getPassportOptions
} from "@/lib/api/passport";

import {
getCircularityDashboard
} from "@/lib/api/passport-details";

import {
CircularityStatCard
} from "@/components/circularity/circularity-stat-card";

import PassportLineage from "@/components/circularity/passport-lineage";
import RecycledMaterials from "@/components/circularity/recycled-materials";


export default function CircularityPage(){

const [passports,setPassports]=
useState<any[]>([]);

const [selectedPassport,setSelectedPassport]=
useState<number|null>(null);

const [data,setData]=
useState<any>(null);

const [loading,setLoading]=
useState(false);



useEffect(()=>{

async function load(){

try{

const result =
await getPassportOptions();

setPassports(result);

}
catch(error){

console.error(
"PASSPORT ERROR:",
error
);

}

}

load();

},[]);




useEffect(()=>{

async function load(){

if(!selectedPassport){

setData(null);

return;

}


try{

setLoading(true);


const result =
await getCircularityDashboard(
selectedPassport
);


console.log(
"CIRCULARITY:",
result
);


setData(result);


}
catch(error){

console.error(
"CIRCULARITY ERROR:",
error
);

}
finally{

setLoading(false);

}

}


load();


},[selectedPassport]);




return (

<div className="space-y-6">


<select

className="w-full rounded-lg border p-3"

value={selectedPassport ?? ""}

onChange={(e)=>
setSelectedPassport(
Number(e.target.value)
)
}

>

<option value="">
Select Passport
</option>


{
passports.map((p)=>(

<option
key={p.id}
value={p.id}
>

{p.passport_id}

</option>

))

}


</select>



{
loading && (

<p className="text-sm text-muted-foreground">
Loading circularity data...
</p>

)

}




{
data && (

<>


{/* Statistics */}

<div className="grid gap-4 md:grid-cols-3">


<CircularityStatCard

title="Recycled Content"

value={
`${data.sustainability?.recycled_content ?? 0}%`
}

/>


<CircularityStatCard

title="Carbon Footprint"

value={
data.sustainability?.carbon_footprint ?? "-"
}

/>


<CircularityStatCard

title="Generation Number"

value={
data.lineage?.[0]?.generation_number ?? "-"
}

/>


</div>





{/* Recycled Material Passport */}

<div className="rounded-lg border p-6">


<h2 className="mb-4 font-semibold">
Recycled Material Passport
</h2>


<RecycledMaterials
passportId={selectedPassport!}
/>


</div>





{/* Lifecycle Events */}

<div className="rounded-lg border p-6">


<h2 className="mb-4 font-semibold">
Lifecycle Events
</h2>


<div className="space-y-3">


{
data.events?.length
?

data.events.map((event:any)=>(

<div
key={event.id}
className="rounded-md border p-3"
>

<p className="font-medium">
{event.event_type}
</p>


<p className="text-sm text-muted-foreground">
{event.notes || "No description"}
</p>


<p className="text-xs text-muted-foreground">
{event.event_date}
</p>


</div>

))

:

<p className="text-sm text-muted-foreground">
No lifecycle events available.
</p>

}


</div>


</div>






{/* Passport Lineage */}

<div className="rounded-lg border p-6">


<h2 className="mb-4 font-semibold">
Passport Lineage
</h2>


<PassportLineage

data={
data.lineage ?? []
}

/>


</div>



</>

)

}


</div>

);

}