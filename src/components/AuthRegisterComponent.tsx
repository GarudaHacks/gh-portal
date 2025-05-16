import React, { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button.tsx"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useAuth } from "@/context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/utils/firebase.ts";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuthErrorMessage } from "@/components/Auth.tsx";
import googleIcon from "/assets/google-icon.svg"
import toast from "react-hot-toast"

const formSchema = z.object({
    email: z.string().email().nonempty("Email is required"),
    password: z.string().nonempty("Password is required"),
    displayName: z.string().nonempty("Name is required"),
})

export default function AuthRegisterComponent() {
    const navigate = useNavigate();

    const { user, loading, loginWithGoogle, signUpWithEmailPassword } = useAuth();
    const [error, setError] = useState<string>("");


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            displayName: "",
        },
    })

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

            const { error } = await signUpWithEmailPassword({
                displayName: values.displayName,
                email: values.email,
                password: values.password,
            });

            if (error) {
                setError(error.message || "Signup failed");
                return;
            } else {
                toast.success("Successfully signed up!");
                navigate("/home");
            }
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        }
    }

    const handleGoogleRegister = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user exists in Firestore
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            // If user doesn't exist, create a new document
            if (!userDoc.exists()) {
                await setDoc(userRef, {
                    email: user.email,
                    displayName: user.displayName,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            }

            const token = await user.getIdToken()
            const { error } = await loginWithGoogle(token);

            if (error) {
                setError(error.message || "Sign Up failed");
            } else {
                toast.success("Successfully signed up!");
                await auth.signOut()
                navigate("/home");
            }
        } catch (error: any) {
            console.error(error);
            setError(getAuthErrorMessage(error));
        }
    };


    return <>
        <div>
            <h2 className="text-2xl font-semibold">
                Sign up for an account
            </h2>
            <p className="text-sm mt-2">
                Join 400+ hackers at SEA’s largest hackathon.
            </p>

            <div className={`pt-4`}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="displayName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={`text-white`}>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your name" type={`text`}
                                            className={`bg-background text-primary`} {...field} />
                                    </FormControl>
                                    <FormMessage className={`text-white`} />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={`text-white`}>Email Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" type={`email`}
                                            className={`bg-background text-primary`} {...field} />
                                    </FormControl>
                                    <FormMessage className={`text-white`} />
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
                                        <Input placeholder="Enter your password" type={`password`}
                                            className={`bg-background text-primary`} {...field} />
                                    </FormControl>
                                    <FormMessage className={`text-white`} />
                                </FormItem>
                            )}
                        />

                        {error && <p className="text-red-100 text-sm text-center mt-4">{error}</p>}

                        <Button
                            type="submit"
                            variant={"secondary"}
                            className={`w-full font-semibold text-white`}
                        >
                            {loading && <LoaderCircle className={"animate-spin"} />}
                            Sign up
                        </Button>


                        {/* Google Sign-up */}
                        <Button
                            type={`button`}
                            variant={"ghost"}
                            onClick={handleGoogleRegister}
                            className="w-full flex items-center justify-center text-black bg-white"
                        >
                            <img src={googleIcon} width={20} height={20} />
                            Sign up with Google
                        </Button>
                    </form>
                </Form>
            </div>
        </div></>;
}