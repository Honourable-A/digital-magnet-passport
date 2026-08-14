"use client";

import {
  useState,
  useEffect
} from "react";

import {
  useRouter
} from "next/navigation";

import {
  FilePlus2,
  Factory,
  Globe2,
  CalendarDays,
  Magnet,
  Car
} from "lucide-react";

import {
  getNextPassportId,
  createPassport,
} from "@/lib/api/passport";

import {
createPassportMaterial
} from "@/lib/api/passport-material";


import {
createPassportSustainability
} from "@/lib/api/passport-sustainability";

export default function CreatePassportPage(){


const router = useRouter();


const [passportId,setPassportId]=useState("");

const [loading,setLoading]=useState(false);



const [form,setForm]=useState({

  passport_id:"",
  magnet_type:"",
  application_sector:"",
  manufacturer:"",
  country_of_origin:"",
  manufacturing_date:"",
  current_stage:"Manufactured"

});





useEffect(()=>{


async function loadId(){


try{


const id =
await getNextPassportId();



setPassportId(id);



setForm(prev=>({

...prev,

passport_id:id

}));



}
catch(error){

console.error(
"ID GENERATION ERROR:",
error
);

}


}



loadId();



},[]);







function updateField(
e:React.ChangeEvent<HTMLInputElement>
){


setForm({

...form,

[e.target.name]:
e.target.value

});


}








async function submit(){



try{


setLoading(true);



if(
!form.magnet_type ||
!form.application_sector ||
!form.manufacturer ||
!form.country_of_origin ||
!form.manufacturing_date
){

alert(
"Please fill all fields"
);

return;

}



const passport = await createPassport(form);


await createPassportMaterial(
 passport.id
);


await createPassportSustainability(
 passport.id
);


router.push(
 `/passport/${passport.passport_id}`
);


}
catch(error:any){


console.error(
"CREATE ERROR:",
error
);


alert(
error.message ||
"Passport creation failed"
);



}
finally{


setLoading(false);


}


}







return (


<div className="w-full max-w-6xl mx-auto space-y-6 px-6">




<button

onClick={()=>router.back()}

className="
rounded-lg
border
px-4
py-2
text-sm
hover:bg-muted
"

>

← Back

</button>






<div>


<h1 className="text-3xl font-semibold tracking-tight">

Create Digital Magnet Passport

</h1>



<p className="text-muted-foreground mt-1">

Register a new magnet passport and begin its lifecycle traceability record.

</p>



</div>







<div

className="
rounded-xl
border
bg-background
p-8
space-y-8
"

>






<div

className="
flex
items-center
gap-3
"

>


<FilePlus2
className="h-6 w-6"
/>



<h2 className="text-xl font-semibold">

Passport Information

</h2>



</div>









<div

className="
grid
gap-6
md:grid-cols-2
"

>






<FormField

label="Passport ID"

icon={
<FilePlus2 className="h-4 w-4"/>
}

name="passport_id"

value={passportId}

readOnly

/>







<FormField

label="Magnet Type"

icon={
<Magnet className="h-4 w-4"/>
}

name="magnet_type"

placeholder="NdFeB N42"

value={form.magnet_type}

onChange={updateField}

/>







<FormField

label="Application Sector"

icon={
<Car className="h-4 w-4"/>
}

name="application_sector"

placeholder="Electric Vehicle Motor"

value={form.application_sector}

onChange={updateField}

/>







<FormField

label="Manufacturer"

icon={
<Factory className="h-4 w-4"/>
}

name="manufacturer"

placeholder="MagnetTech GmbH"

value={form.manufacturer}

onChange={updateField}

/>







<FormField

label="Country of Origin"

icon={
<Globe2 className="h-4 w-4"/>
}

name="country_of_origin"

placeholder="Germany"

value={form.country_of_origin}

onChange={updateField}

/>







<div className="space-y-2">


<label className="text-sm font-medium">

Manufacturing Date

</label>



<div

className="
flex
items-center
gap-2
rounded-lg
border
px-3
"

>


<CalendarDays
className="h-4 w-4 text-muted-foreground"
/>




<input

type="date"

name="manufacturing_date"

value={
form.manufacturing_date
}

onChange={updateField}

className="
w-full
py-3
outline-none
bg-transparent
"

/>



</div>


</div>






</div>









<div

className="
rounded-lg
border
p-4
bg-muted/30
"

>


<p className="text-sm text-muted-foreground">

Current Lifecycle Stage

</p>



<p className="font-semibold">

Manufactured

</p>



</div>







<button

onClick={submit}

disabled={loading}

className="
w-full
rounded-lg
bg-primary
text-primary-foreground
py-3
font-medium
hover:opacity-90
disabled:opacity-50
transition
"

>


{
loading
?
"Creating Passport..."
:
"Create Digital Passport"
}



</button>








</div>





</div>


);



}








function FormField({

label,

icon,

name,

placeholder,

value,

onChange,

readOnly=false


}:any){



return (


<div className="space-y-2">



<label className="text-sm font-medium">

{label}

</label>





<div

className="
flex
items-center
gap-2
rounded-lg
border
px-3
"

>



{icon}



<input


name={name}


placeholder={placeholder}


value={value}


onChange={onChange}


readOnly={readOnly}


className={`
w-full
py-3
outline-none
bg-transparent
${readOnly ? "bg-muted cursor-not-allowed" : ""}
`}


/>



</div>




</div>


);


}