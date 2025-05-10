import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "@/model/User.ts";
import Cookies from "js-cookie";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/utils/firebase";

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
  loginWithGoogle: () => Promise<{
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

const AUTH_STORAGE_KEY = "authUser"; // Define a key for localStorage

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginWithEmailPassword: async () => ({ error: null, data: null }),
  signUpWithEmailPassword: async () => ({ error: null, data: null }),
  loginWithGoogle: async () => ({ error: null, data: null }),
  signOut: async () => ({ error: null, data: null }),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      try {
        return JSON.parse(storedUser) as User;
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem(AUTH_STORAGE_KEY); // Clear corrupted data
      }
    }
    return null;
  });
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

        if (response.ok && mounted) {
          const fetchedUser = data.data.user as User;
          setUser(fetchedUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fetchedUser));
        } else if (mounted) {
          // Invalid session or error response
          setUser(null);
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch (e) {
        console.error("Error checking session:", e);
        if (mounted) {
          // Network error or other exception
          setUser(null);
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    checkSession();

    return () => {
      mounted = false;
    };
  }, []); // Run only on mount

  const loginWithEmailPassword = async (credentials: LoginCredentials) => {
    setLoading(true);
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
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return {
          error: { message: data.message || "Login failed" },
          data: null,
        };
      }

      const loggedInUser = (data.user || data) as User;
      setUser(loggedInUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedInUser)); // Save on success
      return {
        error: null,
        data: { message: "Login successful", user: loggedInUser },
      };
    } catch (e) {
      console.error("Login error:", e);
      localStorage.removeItem(AUTH_STORAGE_KEY);
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
        localStorage.removeItem(AUTH_STORAGE_KEY); // Clear on failure
        return {
          error: { message: data.message || "Signup failed" },
          data: null,
        };
      }

      const signedUpUser = (data.user || data) as User;
      setUser(signedUpUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(signedUpUser)); // Save on success
      return {
        error: null,
        data: { message: "Signup successful", user: signedUpUser },
      };
    } catch (e) {
      console.error("Signup error:", e);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return { error: { message: "Signup failed" }, data: null };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Map Firebase user to User interface
      const mappedUser: User = {
        id: user.uid,
        email: user.email || "",
        first_name: user.displayName?.split(" ")[0] || "",
        last_name: user.displayName?.split(" ").slice(1).join(" ") || null,
        admin: false,
        created_at: user.metadata.creationTime || new Date().toISOString(),
        date_of_birth: null,
        education: null,
        gender_identity: null,
        github: null,
        grade: null,
        linkedin: null,
        portfolio: null,
        school: null,
        status: "active",
        year: null,
      };

      setUser(mappedUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mappedUser));
      return {
        error: null,
        data: { message: "Login successful", user: mappedUser },
      };
    } catch (e) {
      console.error("Login with Google", e);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return { error: { message: "Login failed" }, data: null };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": Cookies.get("XSRF-TOKEN") || "",
        },
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        console.log("API ERROR:", data);
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
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithEmailPassword,
        loginWithGoogle,
        signUpWithEmailPassword,
        signOut,
      }}
    >
      {/* Render children immediately if user is loaded from localStorage, 
          or after loading finishes if not. The checkSession useEffect handles validation. */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);
