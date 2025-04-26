import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useAuth} from "../context/AuthContext";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import {auth, db} from "../utils/firebase";


import ghLogo from "/images/logo/gh_logo.svg"
import {doc, getDoc, setDoc} from "firebase/firestore";
import AuthLoginComponent from "@/components/AuthLoginComponent.tsx";

type FormData = {
  email: string;
  password: string;
};

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
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const [mode, setMode] = useState<"LOGIN" | "SIGNUP">("LOGIN");
  const [error, setError] = useState("");

  const handleSignup = async (data: FormData) => {
    const passwordPolicy = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;

    if (!passwordPolicy.test(data.password)) {
      setError(
        "Password must be at least 8 characters, contain an uppercase letter and a special character."
      );
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, data.email.toLowerCase(), data.password);
      const user = userCred.user;

      if (!user) {
        setError("User creation failed. Please try again.");
        return;
      }

      const ref = doc(db, "users", user.uid);
      const userSnap = await getDoc(ref);

      if (!userSnap.exists()) {
        // New entry in db if it is first time authenticating
        await setDoc(ref, {
          uid: user.uid,
          email: user.email,
          createdAt: new Date(),
        })
      }

      navigate("/home");
    } catch (error: any) {
      setError(getAuthErrorMessage(error));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email) {
        setError("No email associated.");
        return;
      }

      const email = user.email?.toLowerCase();
      const userRef = doc(db, "users", email);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          createdAt: new Date(),
        });
      }

      navigate("/home");
    } catch (error: any) {
      setError(getAuthErrorMessage(error));
    }
  };

  return (
    <div className="flex items-center justify-center h-screen min-w-screen">
      <div
        className="bg-primary p-12 rounded-lg sm:w-full md:max-w-lg md:justify-center shadow-lg  text-white flex flex-col">

        <img src={ghLogo} width={40} height={60} className="mb-4"/>

        {
          mode === "LOGIN" && (
            <AuthLoginComponent />
          )
        }

        {/* Google Sign-in */}
        {/*<button*/}
        {/*  onClick={handleGoogleLogin}*/}
        {/*  className="w-full mt-3 bg-white text-black py-2 rounded flex items-center justify-center gap-[10px]"*/}
        {/*>*/}
        {/*  <img src={googleIcon} width={20} height={20}/>*/}
        {/*  Log in with Google*/}
        {/*</button>*/}

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
