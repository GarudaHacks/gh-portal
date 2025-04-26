import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { User } from "@/model/User.ts";
import Cookies from "js-cookie";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  displayName: string;
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
  signUpWithEmailPassword: (credentials: RegisterCredentials) => Promise<{
    error: {
      message: string;
    } | null;
    data: {
      message: string | null;
      user?: User | null;
    } | null;
  }>;
  loginWithGoogle: (idToken: string) => Promise<{
    error: {
      message: string;
    } | null;
    data: {
      message: string | null;
      user?: User | null;
    } | null;
  }>;
  signOut: () => Promise<{
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
  loginWithEmailPassword: async () => ({ error: null, data: null }),
  signUpWithEmailPassword: async () => ({ error: null, data: null }),
  loginWithGoogle: async () => ({ error: null, data: null }),
  signOut: async () => ({ error: null, data: null }),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session-check", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.data.user);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("Error checking session:", e);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    checkSession();
  }, [])

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
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.message || "Login failed" }, data: null };
      }

      setUser(data.user || data);
      return { error: null, data: { message: "Login successful", user: data.user || data } };
    } catch (e) {
      console.error("Login error:", e);
      return { error: { message: "Login failed" }, data: null };
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmailPassword = async (credentials: RegisterCredentials) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify({
          name: credentials.displayName,
          email: credentials.email,
          password: credentials.password
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.message || "Signup failed" }, data: null };
      }

      setUser(data.user || data);
      return { error: null, data: { message: "Signup successful", user: data.user || data } };
    } catch (e) {
      console.error("Signup error:", e);
      return { error: { message: "Signup failed" }, data: null };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/session-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_token: idToken
        }),
        credentials: "include"
      })

      const data = await response.json()

      if (!response.ok) {
        console.log("API ERROR:", data);
        return { error: { message: data.message || "Login failed" }, data: null };
      }

      setUser(data.user || data);
      console.log("USER SET")
      return { error: null, data: { message: "Login successful", user: data.user || data } };
    } catch (e) {
      console.error("Login with Google", e);
      return { error: { message: "Login failed" }, data: null };
    } finally {
      setLoading(false);
    }
  }

  const signOut = async () => {
    try {
      console.log("Sign Out, XSRF", Cookies.get("XSRF-TOKEN"));
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": Cookies.get("XSRF-TOKEN") || ""
        },
        credentials: "include"
      })
      const data = await response.json()

      if (!response.ok) {
        console.log("API ERROR:", data);
        return { error: { message: data.message || "Logout failed" }, data: null };
      }
      return { error: null, data: { message: "Logout successful", user: data.user || data } };
    } catch (e) {
      console.error("Login error:", e);
      setUser(null);
      return { error: { message: "Login failed" }, data: null };
    } finally {
      setUser(null);
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginWithEmailPassword, loginWithGoogle, signUpWithEmailPassword, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);