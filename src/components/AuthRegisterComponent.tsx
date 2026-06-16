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
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import { useNavigate, Link } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
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
  displayName: z.string().nonempty("Name is required"),
  agreedToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the Terms and Privacy Policy." }),
  }),
});

export default function AuthRegisterComponent() {
  const navigate = useNavigate();

  const { loginWithGoogle, signUpWithEmailPassword, isActionLoading } = useAuth();
  const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      displayName: "",
      agreedToTerms: false as unknown as true,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError("");
    try {
      const passwordPolicy = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
      if (!passwordPolicy.test(values.password)) {
        setError(
          "Password must be at least 8 characters, contain an uppercase letter and a special character."
        );
        return;
      }

      const { error, data } = await signUpWithEmailPassword({
        displayName: values.displayName,
        email: values.email,
        password: values.password,
      });

      if (error) {
        setError(error.message || "Signup failed");
        return;
      } else {
        toast.success(data?.message || "Signup successful");
        navigate("/auth?mode=verify-email");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    }
  }

  const handleGoogleRegister = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" }); // allow user to choose account
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      const token = await user.getIdToken();
      const { error } = await loginWithGoogle(token);

      if (error) {
        setError(error.message || "Sign Up failed");
      } else {
        toast.success("Successfully signed up!");
        await auth.signOut();
        navigate("/home");
      }
    } catch (error: any) {
      console.error(error);
      setError(getAuthErrorMessage(error));
    }
  };

  const handleDiscordRegister = async () => {
    try {
      const state = btoa(JSON.stringify({
        intent: "signup",
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
    <>
      <div>
        <h2 className="text-2xl font-semibold">Sign up for an account</h2>
        <p className="text-sm mt-2">
          Join 400+ hackers at SEA's largest hackathon.
        </p>

        <div className={`pt-4`}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={``}>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        type={`text`}
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={``}>
                      Email Address
                    </FormLabel>
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
                      <Input
                        placeholder="Enter your password"
                        type={`password`}
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
                name="agreedToTerms"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          id="agreedToTerms"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="shrink-0"
                        />
                      </FormControl>
                      <label
                        htmlFor="agreedToTerms"
                        className="text-sm font-normal leading-snug cursor-pointer"
                      >
                        I agree to the{" "}
                        <Link to="/terms" className="underline font-medium" target="_blank">Terms of Service</Link>
                        {" "}and{" "}
                        <Link to="/privacy" className="underline font-medium" target="_blank">Privacy Policy</Link>
                      </label>
                    </div>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {error && (
                <p className="text-red-500 text-sm text-center mt-4">{error}</p>
              )}

              <div className="flex flex-col gap-2.5">
                <Button
                  type="submit"
                  className={`w-full font-semibold`}
                >
                  Sign up
                  {isActionLoading && <LoaderCircle className={"animate-spin"} />}
                </Button>

                {/* Google Sign-up */}
                <Button
                  type={`button`}
                  variant={"ghost"}
                  onClick={handleGoogleRegister}
                  className="w-full flex items-center justify-center bg-white"
                >
                  <img src={googleIcon} width={20} height={20} />
                  Sign up with Google
                </Button>

                {/* Discord Sign-up */}
                <Button
                  type={`button`}
                  variant={"ghost"}
                  onClick={handleDiscordRegister}
                  className="w-full flex items-center justify-center bg-white"
                >
                  <img src={discordIcon} width={20} height={20} />
                  Sign up with Discord
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
