"use client";

interface Props {
passports:any[];
value:number;
onChange:(id:number)=>void;
}


export default function PassportSelector({
passports,
value,
onChange
}:Props){


return (

<div className="mb-6">

<label className="block mb-2 font-medium">
Select Passport
</label>


<select

className="w-full rounded-md border px-3 py-2"

value={value}

onChange={(e)=>
onChange(Number(e.target.value))
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

);

}