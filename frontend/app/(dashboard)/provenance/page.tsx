import { createClient } from "@/lib/supabase/server";
import ProvenanceContainer from "@/components/provenance/provenance-container";


export default async function Page(){


const supabase =
await createClient();



const {
data:passports
}
=
await supabase
.from("passport")
.select(
"id, passport_id"
)
.order("id");



return (

<div className="space-y-6">

<h1 className="text-3xl font-bold">
Provenance Network
</h1>


<ProvenanceContainer
passports={passports ?? []}
/>


</div>

);

}