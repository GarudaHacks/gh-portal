declare module "../context/AuthProvider" {
    import { User } from "firebase/auth";
    import { ReactNode } from "react";

    export interface AuthContextType {
        user: User | null;
        loading: boolean;
    }

    export const AuthProvider: ({ children }: { children: ReactNode }) => JSX.Element;
    export const useAuth: () => AuthContextType;
}