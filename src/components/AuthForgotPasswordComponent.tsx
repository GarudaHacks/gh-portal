import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAuthErrorMessage } from "./Auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

const formSchema = z.object({
  email: z.string().email().nonempty("Email is required"),
});

const AuthForgotPasswordComponent = () => {
  const { resetPassword, loading } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setError("");
    setSuccess(false);

    try {
      const { error } = await resetPassword(values.email);
      if (error) {
        setError(error.message);
        return;
      }
      setSuccess(true);
      toast.success("Password reset link sent to your email!");
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold">Reset Password</h2>
      <p className="text-sm mt-2">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>

      <div className="pt-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      className="text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-white" />
                </FormItem>
              )}
            />

            {error && (
              <p className="text-red-100 text-sm text-center mt-4">{error}</p>
            )}

            {success && (
              <p className="text-green-100 text-sm text-center mt-4">
                Password reset link has been sent to your email!
              </p>
            )}

            <Button
              type="submit"
              className="w-full font-semibold text-white"
              disabled={loading}
            >
              {loading && <LoaderCircle className="animate-spin mr-2" />}
              Send Reset Link
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AuthForgotPasswordComponent;
