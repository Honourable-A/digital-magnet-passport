"use client";

import {
  useEffect,
  useState
} from "react";

import {
  CheckCircle2
} from "lucide-react";

import {
  getPassportEvents
} from "@/lib/api/circularity";


interface PassportEvent {

  id:number;

  event_type?:string;

  event_date?:string;

  notes?:string;

}


export default function Timeline({
  passportId,
}: {
  passportId:number;
}) {


const [events,setEvents] =
useState<PassportEvent[]>([]);


const [loading,setLoading] =
useState(true);



useEffect(()=>{


async function loadEvents(){


try {


const data =
await getPassportEvents(
  passportId
);

console.log("TIMELINE DATA:", data);

console.log(
  "LIFECYCLE EVENTS:",
  data
);



setEvents(
  data ?? []
);



}
catch(error){


console.error(
  "EVENT LOAD ERROR:",
  error
);


setEvents([]);


}
finally{


setLoading(false);


}


}



loadEvents();



},[passportId]);





if(loading){

return (

<p className="text-sm text-muted-foreground">
Loading lifecycle data...
</p>

);

}



if(events.length === 0){

return (

<div className="rounded-lg border p-6">

<h3 className="font-semibold">
No Lifecycle Events Available
</h3>


<p className="mt-2 text-sm text-muted-foreground">
No manufacturing, deployment, recovery or recycling events have been registered for this passport yet.
</p>


</div>

);

}




return (

<div className="space-y-4">


{
events.map((event,index)=>(


<div
key={event.id ?? index}
className="flex gap-4"
>



<div className="flex flex-col items-center">


<CheckCircle2
className="h-6 w-6"
/>



{
index !== events.length - 1 && (

<div className="h-12 border-l"/>

)

}



</div>





<div className="flex-1 rounded-lg border p-4">


<h3 className="font-semibold">

{
event.event_type
?
event.event_type.replaceAll("_"," ")
:
"Lifecycle Event"
}

</h3>




{
event.event_date && (

<p className="text-sm text-muted-foreground">

{
new Date(
event.event_date
).toLocaleDateString()
}

</p>

)

}




{
event.notes && (

<p className="mt-2 text-sm">

{event.notes}

</p>

)

}



</div>



</div>


))

}



</div>

);


}