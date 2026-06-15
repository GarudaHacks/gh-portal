import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/utils/firebase.ts";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuthErrorMessage } from "@/components/Auth.tsx";
import googleIcon from "/assets/google-icon.svg";
import discordIcon from "/images/icons/discord-icon.svg";
import toast from "react-hot-toast";

const formSchema = z.object({
  email: z.string().email().nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

export default function AuthLoginComponent() {
  const navigate = useNavigate();
  const { loginWithEmailPassword, loading, loginWithGoogle, isActionLoading } = useAuth();

  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError("");
    try {
      const { error } = await loginWithEmailPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error("Error when trying to login:", error);
        setError(error.message || "Login failed");
        return;
      }

      // Check if email is verified
      const response = await fetch("/api/auth/session-check", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const sessionData = await response.json();

      if (response.ok && !sessionData.data.user?.emailVerified) {
        toast.error("Please verify your email first");
        // Force navigation to verification page
        window.location.href = "/auth?mode=verify-email";
        return;
      }

      toast.success("Successfully logged in!");
      window.location.href = "/home";
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error when trying to login:", err);
      return;
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      // If user doesn't exist, create a new document
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName,
          status: "not applicable",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      const token = await user.getIdToken();
      const { error } = await loginWithGoogle(token);

      if (error) {
        setError(error.message || "Sign Up failed");
      } else {
        toast.success("Successfully logged in!");
        await auth.signOut();
        navigate("/home");
      }

    } catch (error: any) {
      console.error("Error when trying to login with Google:", error);
      setError(getAuthErrorMessage(error));
    }
  };

  const handleDiscordLogin = async () => {
    try {
      const state = btoa(JSON.stringify({
        intent: "signin",
        csrf: crypto.randomUUID()
      }))
      sessionStorage.setItem("oauth_discord_state", state); // to check against returned by discord
      const params = new URLSearchParams({
        client_id: import.meta.env.VITE_DISCORD_CONFIG_CLIENT_ID,
        redirect_uri: import.meta.env.VITE_DISCORD_CONFIG_REDIRECT_URI,
        response_type: "code",
        scope: import.meta.env.VITE_DISCORD_CONFIG_SCOPE,
        state: state
      });
      window.location.href = `https://discord.com/oauth2/authorize?${params}`
    } catch (error: any) {
      console.error(error)
    }
  };


  return (
    <div>
      <h2 className="text-2xl font-semibold">Login into your account</h2>
      <p className="text-sm mt-2">
        Join 400+ hackers at SEA's largest hackathon.
      </p>

      <div className={`pt-4`}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={``}>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type={`email`}
                      className={``}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className={`text-red-500`} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                        className={`pr-10`}
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center  hover:text-gray-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className={`text-red-500`} />
                </FormItem>
              )}
            />

            {error && (
              <p className="text-red-500 text-sm text-center mt-4">{error}</p>
            )}

            <div className="flex flex-col gap-2.5">
              <Button type="submit" className={`w-full font-semibold`}>
                Log in
                {isActionLoading && <LoaderCircle className={"animate-spin"} />}
              </Button>

              {/* Google Sign-in */}
              <Button
                type={`button`}
                variant={"ghost"}
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center bg-white"
              >
                <img src={googleIcon} width={20} height={20} />
                Log in with Google
              </Button>

              {/* Discord Sign-in */}
              <Button
                type={`button`}
                variant={"ghost"}
                onClick={handleDiscordLogin}
                className="w-full flex items-center justify-center bg-white"
              >
                <img src={discordIcon} width={20} height={20} />
                Sign in with Discord
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
