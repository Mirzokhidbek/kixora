import { createContext } from "react";
import type { Member } from "../../lib/types/member";

export interface GlobalContextType {
  authMember: Member | null;
  setAuthMember: (member: Member | null) => void;
  orderBuilder: Date;
  setOrderBuilder: (time: Date) => void;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);
