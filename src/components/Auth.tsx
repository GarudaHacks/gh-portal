import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
// @ts-ignore
import { useAuth } from "../context/AuthContext";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth, db } from "../utils/firebase";

import googleIcon from "/assets/google-icon.svg"
import ghLogo from "/images/logo/gh_logo.svg"
import { doc, getDoc, setDoc } from "firebase/firestore";

type FormData = {
  email: string;
  password: string;
};

const getAuthErrorMessage = (error: any) => {
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

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // handlers
  const handleLogin = async (data: FormData) => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate("/home");
    } catch (error: any) {
      setError(getAuthErrorMessage(error));
    }
  };

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
      <div className="bg-primary p-12 rounded-lg sm:w-full md:max-w-lg md:justify-center shadow-lg bg-[#9F3737] text-white flex flex-col">

        <img src={ghLogo} width={40} height={60} className="mb-4"/>

        <h2 className="text-2xl font-semibold">
          {mode === "LOGIN" ? "Login into your account" : "Create an account"}
        </h2>
        <p className="text-sm mt-2">
          Join 400+ hackers at SEA’s largest hackathon.
        </p>

        <form
          onSubmit={handleSubmit(mode === "LOGIN" ? handleLogin : handleSignup)}
          className="mt-4 text-sm"
        >
          {/* Email */}
          <label className="block mb-2 text-sm">Email Address</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Enter a valid email address",
              },
            })}
            className="w-full p-2 rounded bg-[#B25F5F] text-white outline-white"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-200 text-xs">{errors.email.message}</p>
          )}

          {/* Password */}
          <label className="block mt-4 mb-2 text-sm">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/,
                message: "Must include 1 uppercase letter and 1 special character",
              }
            })}
            className="w-full p-2 rounded bg-[#B25F5F] text-white outline-white"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-200 text-sm">{errors.password.message}</p>
          )}

          {error && <p className="text-red-100 text-sm text-center mt-4">{error}</p>}
          <button
            type="submit"
            className="w-full mt-4 bg-[#5E1C1B] py-2 rounded font-semibold hover:opacity-90"
          >
            {mode === "LOGIN" ? "Log in" : "Sign up"}
          </button>
        </form>

        {/* Google Sign-in */}
        <button
          onClick={handleGoogleLogin}
          className="w-full mt-3 bg-white text-black py-2 rounded flex items-center justify-center gap-[10px]"
        >
          <img src={googleIcon} width={20} height={20} />
          Log in with Google
        </button>

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
