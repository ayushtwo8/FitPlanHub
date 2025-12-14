"use client";

import api from "@/lib/api";
import { AuthContextType, User } from "@/types";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await api.get("auth/me");
      setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    role: "user" | "trainer"
  ) => {
    const { data } = await api.post("auth/signup", {
      email,
      password,
      name,
      role,
    });
    setUser(data.user);
    router.push(role === "trainer" ? "/dashboard/trainer" : "/dashboard/user");
  };

  const login = async (
    email: string,
    password: string,
    role: "user" | "trainer"
  ) => {
    const { data } = await api.post("auth/login", { email, password, role });
    setUser(data.user);
    router.push(role === "trainer" ? "/dashboard/trainer" : "/dashboard/user");
  };

  const logout = async () => {
    await api.post("auth/logout");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>{
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}