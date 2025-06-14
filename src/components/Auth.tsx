import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import ghLogo from "/images/logo/gh_logo.svg";
import AuthLoginComponent from "@/components/AuthLoginComponent.tsx";
import AuthRegisterComponent from "./AuthRegisterComponent";
import AuthForgotPasswordComponent from "./AuthForgotPasswordComponent";
import AuthVerificationComponent from "./AuthVerificationComponent";

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
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/home");
    }
  }, [user, navigate, loading]);

  useEffect(() => {
    const urlMode = searchParams.get("mode");
    if (urlMode === "verify-email") {
      setMode("VERIFY_EMAIL");
    }
  }, [searchParams]);

  const [mode, setMode] = useState<
    "LOGIN" | "SIGNUP" | "FORGOT_PASSWORD" | "VERIFY_EMAIL"
  >(() => {
    const urlMode = searchParams.get("mode");
    if (urlMode === "verify-email") return "VERIFY_EMAIL";
    return "LOGIN";
  });

  return (
    <div className="flex items-center justify-center h-screen min-w-screen auth">
      <div className="p-12 rounded-lg sm:w-full md:max-w-lg md:justify-center shadow-lg  text-white flex flex-col border-gray-600 bg-opacity-10 bg-white/5 backdrop-blur-md border-2 ">
        <img src={ghLogo} width={40} height={60} className="mb-4" />

        {mode === "LOGIN" && <AuthLoginComponent />}
        {mode === "SIGNUP" && <AuthRegisterComponent />}
        {mode === "FORGOT_PASSWORD" && <AuthForgotPasswordComponent />}
        {mode === "VERIFY_EMAIL" && <AuthVerificationComponent />}

        {/* Toggle Between Login and Signup */}
        <p className="text-center text-sm mt-4">
          {mode === "LOGIN" ? (
            <>
              Don't have an account?
              <span
                className="underline font-semibold cursor-pointer ml-1"
                onClick={() => setMode("SIGNUP")}
              >
                Sign up
              </span>
              <br />
              <span
                className="underline font-semibold cursor-pointer pt-2 block"
                onClick={() => setMode("FORGOT_PASSWORD")}
              >
                Forgot Password?
              </span>
            </>
          ) : mode === "SIGNUP" ? (
            <>
              Already have an account?
              <span
                className="underline font-semibold cursor-pointer ml-1"
                onClick={() => setMode("LOGIN")}
              >
                Log in
              </span>
            </>
          ) : mode === "FORGOT_PASSWORD" ? (
            <>
              Remember your password?
              <span
                className="underline font-semibold cursor-pointer ml-1"
                onClick={() => setMode("LOGIN")}
              >
                Log in
              </span>
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
}

export default Auth;
