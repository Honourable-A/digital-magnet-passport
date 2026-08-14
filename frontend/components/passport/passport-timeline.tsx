"use client";

import { useEffect, useState } from "react";

import {
getPassportEvents,
PassportEvent
} from "@/lib/api/passport";


export default function PassportTimeline({
passportId
}:{
passportId:number;
}) {


const [events,setEvents] =
useState<PassportEvent[]>([]);


const [loading,setLoading] =
useState(true);



useEffect(()=>{


async function loadEvents(){


try{


const data =
await getPassportEvents(
passportId
);


setEvents(data);


}
catch(error){

console.error(
"TIMELINE ERROR:",
error
);

}
finally{

setLoading(false);

}


}


loadEvents();


},[passportId]);



if(loading){

return (
<div>
Loading lifecycle...
</div>
);

}



if(events.length===0){

return (

<div className="rounded-lg border p-4 text-muted-foreground">

No lifecycle events registered.

</div>

);

}



return (

<div className="space-y-6">


<h2 className="text-xl font-semibold">
Passport Lifecycle
</h2>



<div className="space-y-4">


{
events.map((event)=>(
<div
key={event.id}
className="rounded-lg border p-4"
>


<div className="flex justify-between">


<h3 className="font-semibold">
{event.event_type}
</h3>


<p className="text-sm text-muted-foreground">

{
new Date(
event.event_date
).toLocaleDateString()
}

</p>


</div>


<p className="mt-2 text-sm text-muted-foreground">

{
event.notes ??
"No description"
}

</p>


</div>
))
}



</div>


</div>

);


}