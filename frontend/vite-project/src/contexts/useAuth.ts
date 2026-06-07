import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("Component must be wrapped in a provider!");
  }
  return ctx;
};
