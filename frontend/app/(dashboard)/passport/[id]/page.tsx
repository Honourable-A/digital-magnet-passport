import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getPassport } from "@/lib/api/passport";

import PassportTabs from "@/components/passport/passport-tabs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


type PageProps = {
  params: Promise<{
    id: string;
  }>;
};


function getStatusVariant(status: boolean) {
  return status ? "default" : "outline";
}


export default async function PassportPage({
  params,
}: PageProps) {


  const { id } = await params;


  let passport;


  try {

    passport = await getPassport(id);


  } catch(error){


    console.error(
      "Passport lookup failed:",
      error
    );


    notFound();

  }



  return (

    <div className="space-y-6">


      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">


        <div>


          <Button
            asChild
            variant="ghost"
            className="-ml-3 mb-2"
          >

            <Link href="/passport">

              <ArrowLeft className="mr-2 h-4 w-4"/>

              Back to Passports

            </Link>


          </Button>



          <h1 className="text-3xl font-semibold">

            {passport.passport_id}

          </h1>



          <p className="mt-1 text-muted-foreground">

            Digital Magnet Passport

          </p>


        </div>




        <Badge
          variant={
            getStatusVariant(
              passport.status
            )
          }
        >

          {
            passport.status
              ? "Verified"
              : "Pending"
          }

        </Badge>


      </div>




      {/* Role Based Tabs */}

      <PassportTabs
  passport={passport}
/>


    </div>

  );

}