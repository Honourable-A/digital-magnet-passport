"use client";

import { useEffect, useState } from "react";
import PassportProvenanceGraph from "./passport-provenance-graph";


interface Passport {
  id: number;
  passport_id: string;
}


interface Props {
  passports: Passport[];
}



export default function ProvenanceContainer({
  passports,
}: Props) {


const [selectedPassport, setSelectedPassport] =
useState(
  passports[0]?.id ?? 1
);


const [provenance, setProvenance] =
useState<any>(null);


const [loading, setLoading] =
useState(false);



useEffect(()=>{


async function loadProvenance(){


setLoading(true);


try {


const response =
await fetch(
`/api/provenance/${selectedPassport}`
);



const data =
await response.json();



console.log(
"PROVENANCE API DATA:",
data
);



setProvenance(data);



}
catch(error){

console.error(
"PROVENANCE FETCH ERROR:",
error
);


}
finally{

setLoading(false);

}


}



loadProvenance();


},[selectedPassport]);





return (

<div className="space-y-6">



<div>

<label className="block mb-2 font-medium">
Select Passport
</label>



<select

className="w-full rounded-md border p-2"

value={selectedPassport}

onChange={(e)=>
setSelectedPassport(
Number(e.target.value)
)
}

>


{
passports.map((passport)=>(


<option

key={passport.id}

value={passport.id}

>

{passport.passport_id}

</option>


))
}


</select>


</div>




{
loading && (

<p className="text-sm text-muted-foreground">
Loading provenance...
</p>

)
}




{
provenance && !loading && (

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

)
}



</div>

);

}