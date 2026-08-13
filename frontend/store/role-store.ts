import { create } from "zustand";
import { persist } from "zustand/middleware";


export type UserRole =
  | "Manufacturer"
  | "Recycler"
  | "Auditor"
  | "Regulator"
  | "Admin"
  | "Public";


interface RoleStore {

  role: UserRole;

  setRole:(role:UserRole)=>void;

  resetRole:()=>void;

}


export const useRoleStore =
create<RoleStore>()(
  persist(
    (set)=>({

      role:"Public",

      setRole:(role)=>
        set({
          role
        }),

      resetRole:()=>
        set({
          role:"Public"
        })

    }),

    {
      name:"role-storage"
    }

  )
);