import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

import ghLogo from "/images/logo/gh_logo.svg"
import AuthLoginComponent from "@/components/AuthLoginComponent.tsx";
import AuthRegisterComponent from "./AuthRegisterComponent";

export const getAuthErrorMessage = (error: any) => {
  const errorCode = error.code || "";
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "This email is already registered. Try logging in.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case 400:
      return "No account found with this email. Try signing up.";
    case "auth/wrong-password":
      return "Incorrect password. Try again.";
    default:
      return "Something went wrong. Please try again.";
  }
};

function Auth() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/home");
    }
  }, [user, navigate, loading]);

  const [mode, setMode] = useState<"LOGIN" | "SIGNUP">("LOGIN");

  return (
    <div className="flex items-center justify-center h-screen min-w-screen">
      <div
        className="bg-primary p-12 rounded-lg sm:w-full md:max-w-lg md:justify-center shadow-lg  text-white flex flex-col">

        <img src={ghLogo} width={40} height={60} className="mb-4"/>

        {mode === "LOGIN" && (<AuthLoginComponent />)}
        {mode === "SIGNUP" && (<AuthRegisterComponent />)}

        {/* Toggle Between Login and Signup */}
        <p className="text-center text-sm mt-4">
          {mode === "LOGIN"
            ? "Don't have an account?"
            : "Already have an account?"}
          <span
            className="underline font-semibold cursor-pointer ml-1"
            onClick={() => setMode(mode === "LOGIN" ? "SIGNUP" : "LOGIN")}
          >
            {mode === "LOGIN" ? "Sign up" : "Log in"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;
