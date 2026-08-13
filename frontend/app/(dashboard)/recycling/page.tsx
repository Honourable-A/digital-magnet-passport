"use client";

import {
useEffect,
useState
} from "react";

import {
getPassportOptions
} from "@/lib/api/passport";

import {
createRecyclingRecord
} from "@/lib/api/recycling";


export default function RecyclingPage(){

const [passports,setPassports]=
useState<any[]>([]);

const [passportId,setPassportId]=
useState<number | null>(null);

const [material,setMaterial]=
useState("");

const [quantity,setQuantity]=
useState("");

const [notes,setNotes]=
useState("");

const [message,setMessage]=
useState("");



useEffect(()=>{

async function load(){

const data =
await getPassportOptions();

setPassports(data);

}

load();

},[]);




async function submit(){

try{

await createRecyclingRecord({

sourcePassportId:
Number(passportId),

materialType:
material,

quantity:
Number(quantity),

notes

});


setMessage(
"Recycling record created"
);


setMaterial("");

setQuantity("");

setNotes("");


}
catch(error){

console.error(
error
);


setMessage(
"Failed to create record"
);

}

}



return (

<div className="max-w-xl space-y-5 rounded-lg border p-6">


<h1 className="text-xl font-semibold">
Create Recycled Material Passport
</h1>



<select

className="w-full rounded-md border p-2"

value={passportId ?? ""}

onChange={(e)=>
setPassportId(
Number(e.target.value)
)
}

>

<option value="">
Select source passport
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




<select

className="w-full rounded-md border p-2"

value={material}

onChange={(e)=>
setMaterial(
e.target.value
)
}

>

<option value="">
Select recovered material
</option>


<option value="NdPr Oxides">
NdPr Oxides
</option>


<option value="NdFeB Powder">
NdFeB Powder
</option>


<option value="Recovered Rare-Earth Feedstock">
Recovered Rare-Earth Feedstock
</option>


</select>




<input

className="w-full rounded-md border p-2"

placeholder="Quantity (kg)"

value={quantity}

onChange={(e)=>
setQuantity(
e.target.value
)
}

/>




<textarea

className="w-full rounded-md border p-2"

placeholder="Notes"

value={notes}

onChange={(e)=>
setNotes(
e.target.value
)
}

/>




<button

className="rounded-md bg-primary px-4 py-2 text-primary-foreground"

onClick={submit}

>

Create Recycling Record

</button>



{
message && (

<p className="text-sm text-muted-foreground">

{message}

</p>

)

}


</div>

);

}