import { create } from "zustand";


export type UserRole =
 | "Manufacturer"
 | "Recycler"
 | "Auditor"
 | "Regulator"
 | "Admin"
 | "Public";



interface RoleStore {

 role:UserRole;

 setRole:(role:UserRole)=>void;

 resetRole:()=>void;

}



export const useRoleStore =
create<RoleStore>((set)=>({

 role:"Public",


 setRole:(role)=>
 set({
   role
 }),


 resetRole:()=>
 set({
   role:"Public"
 })

}));