"use client";

import { useEffect, useState } from "react";

import {
Tabs,
TabsList,
TabsTrigger,
TabsContent,
} from "@/components/ui/tabs";

import {
Card,
CardContent,
CardHeader,
CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
passportPermissions,
Role,
} from "@/lib/roles";

import {
useRoleStore
} from "@/store/role-store";

import { Passport } from "@/lib/api/passport";

import Composition from "@/components/Composition";
import Performance from "@/components/Performance";
import Circularity from "@/components/passport/circularity";
import Compliance from "@/components/passport/compliance";
import Verification from "@/components/passport/verification";
import Provenance from "@/components/provenance/provenance-tab";


export default function PassportTabs({
passport,
}: {
passport: Passport;
}) {


const role =
useRoleStore(
(state)=>state.role
);


const allowed =
passportPermissions[role as Role]
||
passportPermissions.Manufacturer;



return (

<Tabs
defaultValue="overview"
className="space-y-4"
>


<TabsList>


{allowed.includes("overview") && (
<TabsTrigger value="overview">
Overview
</TabsTrigger>
)}


{allowed.includes("composition") && (
<TabsTrigger value="composition">
Composition
</TabsTrigger>
)}


{allowed.includes("performance") && (
<TabsTrigger value="performance">
Performance
</TabsTrigger>
)}


{allowed.includes("provenance") && (
<TabsTrigger value="provenance">
Provenance
</TabsTrigger>
)}


{allowed.includes("circularity") && (
<TabsTrigger value="circularity">
Circularity
</TabsTrigger>
)}


{allowed.includes("compliance") && (
<TabsTrigger value="compliance">
Compliance
</TabsTrigger>
)}


{allowed.includes("verification") && (
<TabsTrigger value="verification">
Verification
</TabsTrigger>
)}


</TabsList>



<TabsContent value="overview">

<Card>

<CardHeader>

<CardTitle>
Passport Overview
</CardTitle>

</CardHeader>


<CardContent className="space-y-4">


<div>

<p className="text-sm text-muted-foreground">
Passport ID
</p>

<p className="font-semibold">
{passport.passport_id}
</p>

</div>



<div>

<p className="text-sm text-muted-foreground">
Status
</p>


<Badge>
{
passport.status
?
"Verified"
:
"Pending"
}
</Badge>


</div>


</CardContent>


</Card>


</TabsContent>



<TabsContent value="composition">
<Composition passportId={passport.id}/>
</TabsContent>


<TabsContent value="performance">
<Performance passportId={passport.id}/>
</TabsContent>


<TabsContent value="provenance">
<Provenance passportId={passport.id}/>
</TabsContent>


<TabsContent value="circularity">
<Circularity passportId={passport.id}/>
</TabsContent>


<TabsContent value="compliance">
<Compliance passportId={passport.id}/>
</TabsContent>


<TabsContent value="verification">
<Verification passportId={passport.id}/>
</TabsContent>


</Tabs>


);

}