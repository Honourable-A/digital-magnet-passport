"use client";

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

import {
  Badge
} from "@/components/ui/badge";

import {
  useEffect,
  useState,
} from "react";

import {
  getUserRole
} from "@/lib/api/profile";

import {
  passportPermissions,
  Role,
} from "@/lib/roles";

import Composition from "@/components/Composition";
import Performance from "@/components/Performance";
import Circularity from "@/components/passport/circularity";
import Compliance from "@/components/passport/compliance";
import Verification from "@/components/passport/verification";

export default function PassportTabs({
 passport
}:{
 passport:any;
})
{


const [role,setRole] = useState<Role|null>(null);



useEffect(()=>{

  getUserRole()
  .then((r)=>{

    console.log(
      "ROLE:",
      r
    );

    setRole(
      r as Role
    );

  });


},[]);



if(!role){

  return (
    <p>
      Loading permissions...
    </p>
  );

}



const allowed =
passportPermissions[role];



return (

<Tabs
 defaultValue="overview"
 className="space-y-4"
>


<TabsList className="flex flex-wrap">

{
allowed.includes("overview") &&
<TabsTrigger value="overview">
Overview
</TabsTrigger>
}


{
allowed.includes("composition") &&
<TabsTrigger value="composition">
Composition
</TabsTrigger>
}


{
allowed.includes("performance") &&
<TabsTrigger value="performance">
Performance
</TabsTrigger>
}


{
allowed.includes("provenance") &&
<TabsTrigger value="provenance">
Provenance
</TabsTrigger>
}


{
allowed.includes("circularity") &&
<TabsTrigger value="circularity">
Circularity
</TabsTrigger>
}


{
allowed.includes("compliance") &&
<TabsTrigger value="compliance">
Compliance
</TabsTrigger>
}


{
allowed.includes("verification") &&
<TabsTrigger value="verification">
Verification
</TabsTrigger>
}


</TabsList>



{/* ================= OVERVIEW ================= */}


<TabsContent value="overview">


<Card>

<CardHeader>

<CardTitle>
Passport Overview
</CardTitle>

</CardHeader>


<CardContent>


<div className="grid gap-6 md:grid-cols-2">



<div className="space-y-4">


<div>

<p className="text-sm text-muted-foreground">
Passport ID
</p>

<p className="font-medium">
{passport.passport_id}
</p>

</div>



<div>

<p className="text-sm text-muted-foreground">
Magnet Type
</p>

<p className="font-medium">
{passport.magnet_type}
</p>

</div>



<div>

<p className="text-sm text-muted-foreground">
Application Sector
</p>

<p className="font-medium">
{passport.application_sector}
</p>

</div>



<div>

<p className="text-sm text-muted-foreground">
Manufacturing Date
</p>

<p className="font-medium">
{passport.manufacturing_date}
</p>

</div>


</div>




<div className="space-y-4">


<div>

<p className="text-sm text-muted-foreground">
Current Stage
</p>

<p className="font-medium">
{passport.current_stage}
</p>

</div>



<div>

<p className="text-sm text-muted-foreground">
Country of Origin
</p>

<p className="font-medium">
{passport.country_of_origin}
</p>

</div>




<div>

<p className="text-sm text-muted-foreground">
Recycled Content
</p>

<p className="font-medium">
{passport.recycled_content}%
</p>

</div>




<div>

<p className="text-sm text-muted-foreground">
Carbon Footprint
</p>

<p className="font-medium">
{passport.carbon_footprint} kg CO₂e
</p>

</div>



</div>


</div>


<div className="mt-6">

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





{/* ================= COMPOSITION ================= */}


<TabsContent value="composition">

<Card>
  <CardHeader>
    <CardTitle>
      Material Composition
    </CardTitle>
  </CardHeader>

  <CardContent>

        <Composition
  passportId={passport.id}
/>

  </CardContent>

</Card>

</TabsContent>





{/* ================= PERFORMANCE ================= */}
<TabsContent value="performance">

<Card>

<CardHeader>

<CardTitle>
Performance
</CardTitle>

</CardHeader>


<CardContent>

<Performance
 passportId={passport.id}
/>

</CardContent>

</Card>

</TabsContent>


{/* ================= PROVENANCE ================= */}


<TabsContent value="provenance">


<Card>

<CardHeader>

<CardTitle>
Provenance
</CardTitle>

</CardHeader>


<CardContent>

<p className="text-sm text-muted-foreground">
Supply chain provenance information.
</p>

</CardContent>

</Card>


</TabsContent>






{/* ================= CIRCULARITY ================= */}

<TabsContent value="circularity">

  <Card>

    <CardHeader>

      <CardTitle>
        Circularity
      </CardTitle>

    </CardHeader>


    <CardContent>

      <Circularity
        passportId={passport.id}
      />

    </CardContent>


  </Card>


</TabsContent>



{/* ================= COMPLIANCE ================= */}


<TabsContent value="compliance">

<Card>

<CardHeader>

<CardTitle>
Compliance Information
</CardTitle>

</CardHeader>


<CardContent>

<Compliance
 passportId={passport.id}
/>

</CardContent>


</Card>

</TabsContent>


{/* ================= VERIFICATION ================= */}

<TabsContent value="verification">

  <Card>

    <CardHeader>

      <CardTitle>
        Verification Claims
      </CardTitle>

    </CardHeader>


    <CardContent>

      <Verification
        passportId={passport.id}
      />

    </CardContent>


  </Card>

</TabsContent>



</Tabs>

);

}