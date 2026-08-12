"use client";

import {
  useEffect,
  useState
} from "react";

import {
  getPassports
} from "@/lib/api/passport";


import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import {
  FileText,
  CheckCircle2,
  Factory,
  Recycle
} from "lucide-react";


export default function DashboardPage(){


  const [stats,setStats] =
    useState({
      total:0,
      active:0,
      manufacturing:0,
      recycling:0
    });



  useEffect(()=>{


    async function load(){


      try{


        const passports =
          await getPassports();



        setStats({

          total:
            passports.length,


          active:
            passports.filter(
              (p:any)=>p.status
            ).length,


          manufacturing:
            passports.filter(
              (p:any)=>
              p.current_stage==="Manufacturing"
            ).length,


          recycling:
            passports.filter(
              (p:any)=>
              p.current_stage==="End of Life"
            ).length


        });



      }
      catch(error){

        console.error(
          "DASHBOARD ERROR:",
          error
        );

      }


    }


    load();


  },[]);




  return (

    <div className="space-y-8">


      <div>

        <h1 className="text-3xl font-semibold">
          TRACE4MAGNET Dashboard
        </h1>


        <p className="text-muted-foreground mt-2">
          Digital Magnet Passport overview and supply chain status.
        </p>


      </div>




      <div className="grid gap-4 md:grid-cols-4">



        <Card>

          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={18}/>
              Total Passports
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              {stats.total}
            </p>
          </CardContent>

        </Card>





        <Card>

          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 size={18}/>
              Verified
            </CardTitle>
          </CardHeader>

          <CardContent>

            <p className="text-3xl font-bold">
              {stats.active}
            </p>

          </CardContent>

        </Card>





        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2">
              <Factory size={18}/>
              Manufacturing
            </CardTitle>

          </CardHeader>


          <CardContent>

            <p className="text-3xl font-bold">
              {stats.manufacturing}
            </p>

          </CardContent>

        </Card>






        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2">
              <Recycle size={18}/>
              End of Life
            </CardTitle>

          </CardHeader>


          <CardContent>

            <p className="text-3xl font-bold">
              {stats.recycling}
            </p>

          </CardContent>


        </Card>



      </div>





      <Card>

        <CardHeader>

          <CardTitle>
            System Overview
          </CardTitle>

        </CardHeader>


        <CardContent>

          <p className="text-muted-foreground">
            Digital Magnet Passport platform providing
            material traceability, verification,
            compliance monitoring and circularity tracking.
          </p>


        </CardContent>


      </Card>




    </div>

  );


}