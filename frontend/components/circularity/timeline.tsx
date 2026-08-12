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



export default function Timeline({

 passportId,

}:{
 passportId:number;
}){


 const [events,setEvents]=
 useState<any[]>([]);


 const [loading,setLoading]=
 useState(true);



 useEffect(()=>{


  async function load(){


   try{


    const data =
      await getPassportEvents(
        passportId
      );


    setEvents(data);


   }
   catch(error){

    console.error(
      "EVENT ERROR:",
      error
    );

   }
   finally{

    setLoading(false);

   }

  }


  load();


 },[passportId]);





 if(loading){

  return (
    <p className="text-sm text-muted-foreground">
      Loading lifecycle...
    </p>
  );

 }





 if(events.length===0){

  return (

    <div className="rounded-lg border p-6">

      <h3 className="font-semibold">
        No Lifecycle Events
      </h3>


      <p className="text-sm text-muted-foreground mt-2">
        No circularity history available.
      </p>

    </div>

  );

 }





 return (

  <div className="space-y-6">


   {
    events.map(
     (event,index)=>(


      <div
       key={event.id}
       className="flex gap-4"
      >


       <div className="flex flex-col items-center">

        <CheckCircle2
         className="h-6 w-6 text-green-600"
        />


        {
         index !== events.length-1 &&
         (
          <div className="h-12 border-l"/>
         )
        }


       </div>




       <div
        className="rounded-lg border p-4 flex-1"
       >

        <h3 className="font-semibold">
         {event.event_type}
        </h3>


        <p className="text-sm text-muted-foreground">
         {
          new Date(
           event.event_date
          ).toLocaleString()
         }
        </p>


        <p className="mt-2 text-sm">
         {event.notes}
        </p>


       </div>


      </div>


     )
    )
   }


  </div>

 );

}