"use client";


import {
  useEffect,
  useState
} from "react";


import Link from "next/link";


import {
  Badge
} from "@/components/ui/badge";


import {
  Button
} from "@/components/ui/button";


import {
  Card,
  CardContent
} from "@/components/ui/card";


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";


import {
  Passport
} from "@/lib/api/passport";


import {
  getPassportSustainability
} from "@/lib/api/passport-sustainability";


import {
  canViewExactRecycledContent
} from "@/lib/access-policy";


import {
  useRoleStore
} from "@/store/role-store";





type Props = {

  passports: Passport[];

};





export default function PassportTable({

  passports

}: Props) {



const role =
useRoleStore(
(state)=>state.role
);



const canViewExact =
canViewExactRecycledContent(
role
);




const [
  sustainabilityMap,
  setSustainabilityMap
] =
useState<Record<number,any>>({});






useEffect(()=>{


async function loadSustainability(){


const map:
Record<number,any> = {};



for(const passport of passports){


try{


const data =
await getPassportSustainability(
passport.id
);



map[passport.id] =
data;



}
catch(error){


console.error(
"SUSTAINABILITY LOAD ERROR:",
passport.id,
error
);


}


}



setSustainabilityMap(
map
);


}



if(passports.length > 0){

loadSustainability();

}


},[passports]);







return (

<Card>


<CardContent>


<Table>


<TableHeader>


<TableRow>


<TableHead>
Passport ID
</TableHead>


<TableHead>
Magnet Type
</TableHead>


<TableHead>
Application
</TableHead>


<TableHead>
Lifecycle
</TableHead>


<TableHead>
Origin
</TableHead>


<TableHead>
Recycled Content
</TableHead>


<TableHead>
Status
</TableHead>


<TableHead className="text-right">
Action
</TableHead>


</TableRow>


</TableHeader>






<TableBody>


{
passports.length === 0 ? (


<TableRow>


<TableCell
colSpan={8}
className="text-center"
>

No passports found.

</TableCell>


</TableRow>


) : (


passports.map(
(passport)=>(


<TableRow
key={passport.id}
>



<TableCell>

{passport.passport_id}

</TableCell>





<TableCell>

{passport.magnet_type}

</TableCell>





<TableCell>

{passport.application_sector}

</TableCell>





<TableCell>

{passport.current_stage}

</TableCell>





<TableCell>

{passport.country_of_origin}

</TableCell>





<TableCell>


{

canViewExact

?

`${

sustainabilityMap[
passport.id
]?.recycled_content
??
"-"

}%`


:

"Verified > 20%"

}



</TableCell>








<TableCell>


<Badge

variant={
passport.status
?
"default"
:
"outline"
}

>


{
passport.status
?
"Verified"
:
"Pending"
}


</Badge>


</TableCell>







<TableCell
className="text-right"
>


<Button

asChild

size="sm"

variant="outline"

>


<Link
href={`/passport/${passport.passport_id}`}
>

View

</Link>


</Button>



</TableCell>






</TableRow>


)

)


)

}




</TableBody>


</Table>


</CardContent>


</Card>


);


}