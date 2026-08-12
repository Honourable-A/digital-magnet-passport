"use client";


import {
  ArrowDown,
  FileText,
  Recycle
} from "lucide-react";


import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";



type LineageItem = {

  id:number;

  source_passport_id:number;

  target_passport_id:number;

  recovery_method:string;

  generation_number:number;

};



type Props = {

  data:LineageItem[];

};



export default function PassportLineage({

  data

}:Props){





if(!data || data.length===0){


return (

<Card>

<CardHeader>

<CardTitle>
Passport Lineage
</CardTitle>

</CardHeader>


<CardContent>

<p className="text-muted-foreground">
No recycling lineage has been registered for this passport.
</p>

</CardContent>


</Card>

);


}






return (

<Card>


<CardHeader>

<CardTitle>
Passport Lineage
</CardTitle>

</CardHeader>



<CardContent className="space-y-6">



{
data.map(
(item)=>(


<div
key={item.id}
className="flex flex-col items-center"
>



<div className="w-full max-w-md rounded-xl border p-5">


<div className="flex items-center gap-3">


<FileText className="h-6 w-6"/>


<div>


<p className="text-sm text-muted-foreground">
Source Passport
</p>


<p className="text-xl font-semibold">
DMP-{String(item.source_passport_id).padStart(4,"0")}
</p>


</div>


</div>


</div>





<ArrowDown
className="h-8 w-8 my-3"
/>






<div className="w-full max-w-md rounded-xl border p-5">


<div className="flex items-center gap-3">


<Recycle className="h-6 w-6"/>


<div>


<p className="text-sm text-muted-foreground">
Recycled Passport
</p>


<p className="text-xl font-semibold">
DMP-{String(item.target_passport_id).padStart(4,"0")}
</p>


</div>


</div>





<div className="grid grid-cols-2 gap-4 mt-5">


<div className="rounded-lg border p-3">

<p className="text-sm text-muted-foreground">
Recovery Method
</p>


<p className="font-semibold">
{item.recovery_method}
</p>

</div>





<div className="rounded-lg border p-3">


<p className="text-sm text-muted-foreground">
Generation
</p>


<p className="font-semibold">
{item.generation_number}
</p>


</div>


</div>



</div>



</div>


)
)
}



</CardContent>


</Card>

);


}