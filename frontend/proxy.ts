import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";


const rolePermissions = {

  Manufacturer:[
    "/dashboard",
    "/passport",
    "/create-passport",
    "/compliance",
    "/circularity",
    "/provenance",
    "/assistant",
  ],

  Recycler:[
    "/dashboard",
    "/passport",
    "/circularity",
    "/provenance",
    "/recycling",
    "/assistant",
  ],

  Auditor:[
    "/dashboard",
    "/passport",
    "/verification",
    "/compliance",
    "/provenance",
    "/assistant",
  ],

  Regulator:[
    "/dashboard",
    "/passport",
    "/verification",
    "/compliance",
    "/circularity",
    "/provenance",
    "/blockchain",
    "/assistant",
  ],

  Admin:[
    "/dashboard",
    "/passport",
    "/create-passport",
    "/verification",
    "/compliance",
    "/circularity",
    "/provenance",
    "/blockchain",
    "/assistant",
  ],

};


export async function proxy(
request:NextRequest
){

let response =
NextResponse.next({
request,
});


const supabase =
createServerClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
{

cookies:{

getAll(){

return request.cookies.getAll();

},


setAll(cookies){

cookies.forEach(
({name,value})=>
request.cookies.set(
name,
value
)
);


response =
NextResponse.next({
request,
});


cookies.forEach(
({name,value,options})=>
response.cookies.set(
name,
value,
options
)
);

}

}

}

);



const {
data:{
user
}
}
=
await supabase.auth.getUser();



const pathname =
request.nextUrl.pathname;



// protect private routes

if(
pathname !== "/login"
&&
!user
){

const loginUrl =
new URL(
"/login",
request.url
);


loginUrl.searchParams.set(
"redirect",
pathname
);


return NextResponse.redirect(
loginUrl
);

}



// RBAC check

if(user){


const rawRole =
user.user_metadata?.role
||
"PUBLIC";


const role =
rawRole.charAt(0).toUpperCase()
+
rawRole.slice(1).toLowerCase();

const allowed =
rolePermissions[
role as keyof typeof rolePermissions
];


const hasAccess =
allowed?.some(
(route)=>
pathname.startsWith(route)
);



if(
!hasAccess
){

return NextResponse.redirect(
new URL(
"/dashboard",
request.url
)
);

}


}



return response;

}



export const config = {

matcher:[

"/dashboard/:path*",

"/passport/:path*",

"/create-passport/:path*",

"/verification/:path*",

"/compliance/:path*",

"/circularity/:path*",

"/provenance/:path*",

"/blockchain/:path*",

"/assistant/:path*",

"/recycling/:path*",

]

};