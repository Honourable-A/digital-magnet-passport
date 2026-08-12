"use client";


import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useRoleStore
} from "@/store/role-store";


import {
  Bot,
  ClipboardCheck,
  FileText,
  GitBranch,
  LayoutDashboard,
  Recycle,
  Blocks,
  ShieldCheck,
  PlusCircle,
} from "lucide-react";



const navigation = [

  {
    name:"Create Passport",
    href:"/create-passport",
    icon:PlusCircle,
    roles:[
      "Manufacturer",
      "Admin"
    ]
  },


  {
    name:"Dashboard",
    href:"/dashboard",
    icon:LayoutDashboard,
  },


  {
    name:"Passports",
    href:"/passport",
    icon:FileText,
  },


  {
    name:"Provenance Network",
    href:"/provenance",
    icon:GitBranch,
  },


  {
    name:"Verification",
    href:"/verification",
    icon:ShieldCheck,
  },


  {
    name:"Compliance",
    href:"/compliance",
    icon:ClipboardCheck,
  },


  {
    name:"Circularity",
    href:"/circularity",
    icon:Recycle,
  },


  {
    name:"Blockchain",
    href:"/blockchain",
    icon:Blocks,
  },


  {
    name:"AI Assistant",
    href:"/assistant",
    icon:Bot,
  },

];





export function Sidebar(){


const pathname = usePathname();

const role = useRoleStore(
(state)=>state.role
);


return (

<aside className="
hidden
sticky
top-0
h-screen
w-64
border-r
bg-background
md:flex
md:flex-col
">



<div className="
border-b
px-6
py-5
">

<h1 className="
text-lg
font-semibold
">

TRACE4MAGNET

</h1>


<p className="
text-sm
text-muted-foreground
">

Digital Magnet Passport

</p>


</div>





<nav className="
flex-1
overflow-y-auto
p-4
space-y-1
">

{
navigation
.filter((item)=>{

  if(!item.roles){

    return true;

  }


  return item.roles.includes(role);

})
.map((item)=>{


const Icon=item.icon;



const isActive =
pathname===item.href ||
pathname.startsWith(
`${item.href}/`
);



return (


<Link

key={item.href}

href={item.href}

className={`
flex
items-center
gap-3
rounded-md
px-3
py-2
text-sm
font-medium
transition

${
isActive
?
"bg-primary text-primary-foreground"
:
"text-muted-foreground hover:bg-muted hover:text-foreground"
}

`}

>


<Icon
className="h-4 w-4"
/>


{item.name}


</Link>


);


})


}



</nav>



</aside>


);


}