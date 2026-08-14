import { createClient } from "@/lib/supabase/client";


export interface Passport {

id:number;

passport_id:string;

magnet_type:string;

application_sector:string;

manufacturer:string | null;

country_of_origin:string;

manufacturing_date:string;

current_stage:string;

status:boolean;

created_at:string | null;

updated_at:string | null;

}



export interface PassportEvent {

id:number;

passport_id:number;

event_type:string;

event_date:string;

notes:string | null;

performed_by:string | null;

}


/*
Get all passports

Used by:
- /passport
- /circularity dropdown
- /verification dropdown
*/

export async function getPassports(): Promise<Passport[]> {

const supabase = createClient();


const {
data,
error
} = await supabase
.from("passport")
.select(`
id,
passport_id,
magnet_type,
application_sector,
manufacturer,
country_of_origin,
manufacturing_date,
current_stage,
status,
created_at,
updated_at
`)
.order(
"id",
{
ascending:true
}
);



console.log(
"PASSPORT LIST ERROR:",
error
);



if(error){

throw error;

}


return data ?? [];

}



/*
Get single passport

Supports:

/passport/31
/passport/DMP-2024-001
*/

export async function getPassport(
passportIdentifier:string
):Promise<Passport>{


const supabase=createClient();



console.log(
"LOOKING FOR PASSPORT:",
passportIdentifier
);



const isNumeric =
!isNaN(
Number(passportIdentifier)
);



let query =
supabase
.from("passport")
.select(`
id,
passport_id,
magnet_type,
application_sector,
manufacturer,
country_of_origin,
manufacturing_date,
current_stage,
status,
created_at,
updated_at
`);



if(isNumeric){


query =
query.eq(
"id",
Number(passportIdentifier)
);


}
else{


query =
query.eq(
"passport_id",
passportIdentifier
);


}



const {
data,
error
}=await query.maybeSingle();



console.log(
"PASSPORT RESULT:",
data
);


console.log(
"PASSPORT ERROR:",
error
);



if(error || !data){

throw new Error(
"Passport not found"
);

}



return data;

}



/*
Get passport lifecycle events

Used by:
- Passport timeline
*/

export async function getPassportEvents(
passportId:number
):Promise<PassportEvent[]>{


const supabase=createClient();



const {
data,
error
}=await supabase
.from("passport_event")
.select(`
id,
passport_id,
event_type,
event_date,
notes,
performed_by
`)
.eq(
"passport_id",
passportId
)
.order(
"event_date",
{
ascending:true
}
);



if(error){


console.error(
"EVENT FETCH ERROR:",
error
);


throw error;


}



return data ?? [];

}



/*
Get passport dropdown data

Used by:

- Circularity
- Verification
- Compliance selectors
*/

export async function getPassportOptions(){


const supabase=createClient();



const {
data,
error
}=await supabase
.from("passport")
.select(`
id,
passport_id
`)
.order(
"id",
{
ascending:true
}
);



console.log(
"PASSPORT OPTIONS:",
data
);



console.log(
"PASSPORT OPTIONS ERROR:",
error
);



if(error){

throw error;

}



return data ?? [];

}



/*
Create passport
*/

export async function createPassport(
passportData:{
passport_id:string;
magnet_type:string;
application_sector:string;
manufacturer:string;
country_of_origin:string;
manufacturing_date:string;
current_stage:string;
}
){


const supabase=createClient();



const {
data:userData,
error:userError
}=await supabase.auth.getUser();



if(userError || !userData.user){

throw new Error(
"User not authenticated"
);

}



const {
data:passport,
error:passportError
}=await supabase
.from("passport")
.insert([
{
...passportData,
status:true
}
])
.select()
.single();



if(passportError){

console.error(
"PASSPORT CREATE ERROR:",
passportError
);


throw passportError;

}



const {
error:eventError
}=await supabase
.from("passport_event")
.insert([
{
passport_id:passport.id,

event_type:"Manufactured",

performed_by:userData.user.id,

event_date:
passport.manufacturing_date ??
new Date().toISOString(),

notes:
"Magnet passport created and manufactured"

}
]);



if(eventError){

console.error(
"PASSPORT EVENT CREATE ERROR:",
eventError
);


throw eventError;

}



await createPassportMaterial(
passport.id
);



await createPassportSustainability(
passport.id
);



return passport;

}



/*
Create default material
*/

export async function createPassportMaterial(
passportId:number
){


const supabase=createClient();



const {
data:existing,
error:checkError
}=await supabase
.from("passport_material")
.select("id")
.eq(
"passport_id",
passportId
)
.maybeSingle();



if(checkError){

throw checkError;

}



if(existing){

return existing;

}



const {
data,
error
}=await supabase
.from("passport_material")
.insert([
{

passport_id:passportId,

nd:25,
pr:5,
dy:1,
tb:0,

ce:0,
la:0,
sm:0,

fe:60,
b:1,

magnet_grade:"N42",

coercivity:900,

remanence:1.3,

temperature_class:"150C"

}
])
.select()
.maybeSingle();



if(error){

throw error;

}



return data;

}



/*
Create default sustainability
*/

export async function createPassportSustainability(
passportId:number
){


const supabase=createClient();



const {
data:existing,
error:checkError
}=await supabase
.from("passport_sustainability")
.select("id")
.eq(
"passport_id",
passportId
)
.maybeSingle();



if(checkError){

throw checkError;

}



if(existing){

return existing;

}



const {
data,
error
}=await supabase
.from("passport_sustainability")
.insert([
{

passport_id:passportId,

recycled_content:0,

carbon_footprint:0,

radioactivity:0,

conflict_mineral_status:"Compliant"

}
])
.select()
.maybeSingle();



if(error){

throw error;

}



return data;

}



/*
Generate next passport ID
*/

export async function getNextPassportId(){


const supabase=createClient();



const {
count,
error:countError
}=await supabase
.from("passport")
.select(
"id",
{
count:"exact",
head:true
}
);



if(countError){

throw countError;

}



const next =
(count ?? 0)+1;



const year =
new Date().getFullYear();



return `DMP-${year}-${String(next).padStart(3,"0")}`;

}