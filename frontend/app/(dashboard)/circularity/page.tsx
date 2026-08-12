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
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";


import {
  CircularityStatCard
} from "@/components/circularity/circularity-stat-card";


import PassportLineage
from "@/components/circularity/passport-lineage";



export default function CircularityPage(){


const [passports,setPassports]=
useState<any[]>([]);



const [selectedPassport,setSelectedPassport]=
useState<number | null>(null);



const [data,setData]=
useState<any>(null);



const [loading,setLoading]=
useState(false);





useEffect(()=>{


async function loadPassports(){


try{


const result =
await getPassportOptions();


setPassports(result);


}
catch(error){

console.error(
"PASSPORT ERROR",
error
);

}


}


loadPassports();


},[]);







useEffect(()=>{


async function loadCircularity(){


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
"CIRCULARITY ERROR",
error
);


}
finally{

setLoading(false);

}


}


loadCircularity();



},[selectedPassport]);







return (

<div className="space-y-6">


<div>

<h1 className="text-3xl font-semibold">
Compliance & Circularity
</h1>


<p className="text-muted-foreground">
Review material circularity, lifecycle events and recovery lineage.
</p>


</div>





<Card>


<CardHeader>

<CardTitle>
Select Passport
</CardTitle>

</CardHeader>



<CardContent>


<select

className="
w-full
rounded-lg
border
p-3
"

value={
selectedPassport ?? ""
}


onChange={
(e)=>
setSelectedPassport(
Number(e.target.value)
)
}

>


<option value="">
Select Passport
</option>



{
passports.map(
(passport)=>(

<option
key={passport.id}
value={passport.id}
>

{passport.passport_id}

</option>

)
)
}


</select>


</CardContent>


</Card>








{
loading &&

<p>
Loading circularity...
</p>

}









{
data &&

<>





<Card>


<CardHeader>

<CardTitle>
Passport Circularity Summary
</CardTitle>

</CardHeader>



<CardContent>


<div
className="
grid
gap-4
md:grid-cols-3
"
>



<CircularityStatCard

title="Recycled Content"

value={
`${data?.sustainability?.recycled_content ?? 0}%`
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


</CardContent>


</Card>









<Card>


<CardHeader>

<CardTitle>
Circularity Lifecycle
</CardTitle>

</CardHeader>


<CardContent className="space-y-4">


{
data.events?.map(
(event:any)=>(


<div
key={event.id}
className="
rounded-lg
border
p-4
"
>


<div className="flex justify-between">


<p className="font-semibold">
{event.event_type}
</p>


<p className="text-sm text-muted-foreground">
{
new Date(
event.event_date
).toLocaleDateString()
}
</p>


</div>



<p className="text-sm text-muted-foreground mt-2">
{event.notes}
</p>


</div>


)
)
}



</CardContent>


</Card>









<PassportLineage

data={
data.lineage ?? []
}

/>





</>

}




</div>

);


}