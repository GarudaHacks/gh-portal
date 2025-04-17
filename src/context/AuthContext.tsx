import React, {createContext, ReactNode, useContext, useState} from "react";
import {User} from "firebase/auth";
import {api} from "@/utils/api.ts";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithEmailPassword: (credentials: LoginCredentials) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginWithEmailPassword: async () => false
});

export const AuthProvider = ({children}: { children: ReactNode }): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     setUser(currentUser);
  //     setLoading(false);
  //   });
  //   return () => unsubscribe();
  // }, []);

  const loginWithEmailPassword = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await api.post(`auth/login`, {
          email: credentials.email,
          password: credentials.password,
      });

      console.log(response);

      // if (response) {
      //   // Manually set the user based on the response
      //   setUser({
      //     uid: authResponse.userId,
      //     email: credentials.email,
      //   } as User);
      //   return true;
      // }
      return true;
    } catch (e) {
      console.error("Login error:", e);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{user, loading, loginWithEmailPassword}}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);