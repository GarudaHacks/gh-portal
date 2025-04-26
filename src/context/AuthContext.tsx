import React, {createContext, ReactNode, useContext, useState} from "react";
import {User} from "@/model/User.ts";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithEmailPassword: (credentials: LoginCredentials) => Promise<{
    error: {
      message: string;
    } | null;
    data: {
      message: string | null;
      user?: User | null;
    } | null;
  }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginWithEmailPassword: async () => ({error: null, data: null}),
});

export const AuthProvider = ({children}: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const loginWithEmailPassword = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("API ERROR:", data);
        return {error: {message: data.message || "Login failed"}, data: null};
      }

      setUser(data.user || data);
      console.log("USER SET")
      console.log("USER SET")
      return {error: null, data: {message: "Login successful", user: data.user || data}};
    } catch (e) {
      console.error("Login error:", e);
      return {error: {message: "Login failed"}, data: null};
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{user, loading, loginWithEmailPassword}}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);