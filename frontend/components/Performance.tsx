"use client";


import {
  useEffect,
  useState
} from "react";


import {
  getPassportPerformance
} from "@/lib/api/performance";



export default function Performance({

  passportId

}:{

  passportId:number;

}) {


const [performance,setPerformance] =
useState<any>(null);


const [loading,setLoading] =
useState(true);



useEffect(()=>{


async function loadPerformance(){


try{

const data =
await getPassportPerformance(
  passportId
);


console.log(
  "PERFORMANCE DATA:",
  data
);


setPerformance(data);


}
catch(error){

console.error(
 "PERFORMANCE ERROR:",
 error
);

}
finally{

setLoading(false);

}


}


loadPerformance();


},[passportId]);





if(loading){

return (
<p>
Loading performance...
</p>
);

}




if(!performance){

return (
<p>
No performance data available.
</p>
);

}




return (

<div className="grid gap-4 md:grid-cols-2">


<div className="rounded-lg border p-4">

<p className="text-sm text-muted-foreground">
Magnet Grade
</p>

<p className="font-semibold">
{performance.magnet_grade}
</p>

</div>



<div className="rounded-lg border p-4">

<p className="text-sm text-muted-foreground">
Coercivity
</p>

<p className="font-semibold">
{performance.coercivity}
</p>

</div>




<div className="rounded-lg border p-4">

<p className="text-sm text-muted-foreground">
Remanence
</p>

<p className="font-semibold">
{performance.remanence}
</p>

</div>




<div className="rounded-lg border p-4">

<p className="text-sm text-muted-foreground">
Temperature Class
</p>

<p className="font-semibold">
{performance.temperature_class}
</p>

</div>



</div>

);


}