import { createContext, useContext, useState, ReactNode } from "react";
import type { Member } from "../../lib/types/member";

interface GlobalContextType {
  authMember: Member | null;
  setAuthMember: (member: Member | null) => void;
  orderBuilder: Date;
  setOrderBuilder: (time: Date) => void;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);

interface ContextProviderProps {
  children: ReactNode;
}

export function ContextProvider({ children }: ContextProviderProps) {
  const memberJson: string | null = localStorage.getItem("member_data");
  const initialMember: Member | null = memberJson ? JSON.parse(memberJson) : null;

  const [authMember, setAuthMemberState] = useState<Member | null>(initialMember);
  const [orderBuilder, setOrderBuilder] = useState<Date>(new Date());

  const setAuthMember = (member: Member | null) => {
    setAuthMemberState(member);
    if (member) {
      localStorage.setItem("member_data", JSON.stringify(member));
    } else {
      localStorage.removeItem("member_data");
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        authMember,
        setAuthMember,
        orderBuilder,
        setOrderBuilder,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

/** CUSTOM HOOK: useGlobals **/
export function useGlobals(): GlobalContextType {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobals must be used within a ContextProvider");
  }
  return context;
}
