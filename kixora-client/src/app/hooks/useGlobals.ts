import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import type { GlobalContextType } from "../context/GlobalContext";

export function useGlobals(): GlobalContextType {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobals must be used within a ContextProvider");
  }
  return context;
}
