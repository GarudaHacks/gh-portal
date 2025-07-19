import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "@/model/User.ts";
import Cookies from "js-cookie";
import { UserApplicationStatus } from "../types/applicationStatus";
import { UserRole } from "@/types/auth";
import { fetchMyRole } from "@/lib/http/auth";

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
  isActionLoading: boolean;
  applicationStatus: UserApplicationStatus;
  role: UserRole;
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
  resetPassword: (email: string) => Promise<{
    error: {
      message: string;
    } | null;
    data: {
      message: string | null;
    } | null;
  }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isActionLoading: false,
  applicationStatus: UserApplicationStatus.NOT_APPLICABLE,
  role: UserRole.HACKER,
  loginWithEmailPassword: async () => ({ error: null, data: null }),
  signUpWithEmailPassword: async () => ({ error: null, data: null }),
  loginWithGoogle: async () => ({ error: null, data: null }),
  signOut: async () => ({ error: null, data: null }),
  resetPassword: async () => ({ error: null, data: null }),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState<boolean>(false);

  const [applicationStatus, setApplicationStatus] = useState<UserApplicationStatus>(
    UserApplicationStatus.NOT_APPLICABLE
  );
  const [role, setRole] = useState<UserRole>(UserRole.HACKER);

  const fetchApplicationStatus = async (): Promise<UserApplicationStatus> => {
    try {
      const response = await fetch("/api/application/status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        return data.data || UserApplicationStatus.NOT_APPLICABLE;
      } else {
        console.error("Error fetching application status:", data.error);
        return UserApplicationStatus.NOT_APPLICABLE;
      }
    } catch (e) {
      console.error("Error fetching application status:", e);
      return UserApplicationStatus.NOT_APPLICABLE;
    }
  };

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

        if (response.ok && data.data.user?.emailVerified) {
          setUser(data.data.user);
          const status = await fetchApplicationStatus();
          if (mounted) {
            setApplicationStatus(status);
          }
        } else {
          setUser(null);
          if (mounted) {
            setApplicationStatus(UserApplicationStatus.NOT_APPLICABLE);
          }
        }

        fetchMyRole().then((res) => {
          setRole(res)
        })
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
    };
    checkSession();
  }, []);

  const loginWithEmailPassword = async (credentials: LoginCredentials) => {
    setIsActionLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Login error:", data);
        return {
          error: { message: data.error || "Login failed" },
          data: null,
        };
      }

      if (data.user?.emailVerified || data.emailVerified) {
        setUser(data.user || data);
        const status = await fetchApplicationStatus();
        setApplicationStatus(status);
      } else {
        setUser(null);
      }

      fetchMyRole().then((res) => {
        setRole(res)
      })

      return {
        error: null,
        data: { message: "Login successful", user: data.user || data },
      };
    } catch (e) {
      console.error("Login error:", e);
      return { error: { message: "Login failed" }, data: null };
    } finally {
      setIsActionLoading(false);
    }
  };

  const signUpWithEmailPassword = async (credentials: RegisterCredentials) => {
    setIsActionLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: credentials.displayName,
          email: credentials.email,
          password: credentials.password,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: { message: data.error || "Signup failed" },
          data: null,
        };
      }

      setUser(null);
      return {
        error: null,
        data: { message: data.message, user: data.user || data },
      };
    } catch (e) {
      console.error("Signup error:", e);
      return { error: { message: "Signup failed" }, data: null };
    } finally {
      setIsActionLoading(false);
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    try {
      const response = await fetch("/api/auth/session-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_token: idToken,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: { message: data.message || "Login failed" },
          data: null,
        };
      }

      setUser(data.user || data);
      const status = await fetchApplicationStatus();
      setApplicationStatus(status);

      fetchMyRole().then((res) => {
        setRole(res)
      })
      return {
        error: null,
        data: { message: "Login successful", user: data.user || data },
      };
    } catch (e) {
      console.error("Login with Google", e);
      return { error: { message: "Login failed" }, data: null };
    }
  };

  const signOut = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-xsrf-token": Cookies.get("XSRF-TOKEN") || "",
        },
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          error: { message: data.error || "Logout failed" },
          data: null,
        };
      }
      return {
        error: null,
        data: { message: "Logout successful", user: data.user || data },
      };
    } catch (e) {
      console.error("Login error:", e);
      setUser(null);
      return { error: { message: "Login failed" }, data: null };
    } finally {
      setUser(null);
      setApplicationStatus(UserApplicationStatus.NOT_APPLICABLE);
      setLoading(false)
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: { message: data.message || "Password reset failed" },
          data: null,
        };
      }

      return {
        error: null,
        data: { message: "Password reset email sent successfully" },
      };
    } catch (e) {
      console.error("Password reset error:", e);
      return { error: { message: "Password reset failed" }, data: null };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isActionLoading,
        applicationStatus,
        role,
        loginWithEmailPassword,
        loginWithGoogle,
        signUpWithEmailPassword,
        signOut,
        resetPassword,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);
