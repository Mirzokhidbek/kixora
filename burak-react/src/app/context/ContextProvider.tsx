import { useState, ReactNode } from "react";
import type { Member } from "../../lib/types/member";
import { GlobalContext } from "./GlobalContext";

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
