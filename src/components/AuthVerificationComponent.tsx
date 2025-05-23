import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function AuthVerificationComponent() {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const { signOut } = useAuth();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkVerificationStatus = async () => {
      try {
        const response = await fetch("/api/auth/session-check", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.data.user?.emailVerified) {
          toast.success("Email verified successfully!");
          clearInterval(intervalId);
          window.location.href = "/home";
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
      }
    };

    // Initial check
    checkVerificationStatus();

    // Set up polling every 5 seconds
    intervalId = setInterval(checkVerificationStatus, 5000);

    // Cleanup interval on component unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [navigate]);

  const handleResendVerification = async () => {
    setIsVerifying(true);
    try {
      const response = await fetch("/api/auth/verify-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Verification email sent successfully!");
      } else {
        toast.error(data.message || "Failed to send verification email");
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast.error("Failed to send verification email");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBackToLogin = async () => {
    try {
      await signOut();
      window.location.href = "/auth?mode=login";
    } catch (error) {
      console.error("Error during logout:", error);
      // Still redirect even if logout fails
      window.location.href = "/auth?mode=login";
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold">Verify your email</h2>
      <p className="text-sm mt-2">
        We've sent a verification link to your email address. Please check your
        inbox and click the link to verify your account.
      </p>

      <div className="pt-4">
        <div className="space-y-4">
          <p className="text-sm text-center">
            Didn't receive the email? Check your spam folder or click the button
            below to resend.
          </p>

          <Button
            onClick={handleResendVerification}
            className="w-full font-semibold text-white"
            disabled={isVerifying}
          >
            {isVerifying && <LoaderCircle className="animate-spin mr-2" />}
            Resend Verification Email
          </Button>

          <p className="text-sm text-center">
            After verifying your email, you'll be automatically redirected to
            the home page.
          </p>

          <p className="text-sm text-center mt-4">
            Want to try a different account?
            <span
              className="underline font-semibold cursor-pointer ml-1"
              onClick={handleBackToLogin}
            >
              Back to Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
