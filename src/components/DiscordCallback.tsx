import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const DiscordCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const code = searchParams.get("code");
    if (!code) {
      navigate("/auth");
      return;
    }
    
    const raw = searchParams.get("state"); // get raw containing intent & csrf generated
    if (!raw) {
      navigate("/auth");
      return;
    }
    const savedState = sessionStorage.getItem("oauth_discord_state");
    if (!raw || raw !== savedState) {
      console.error("Suspicious activity detected.");
      return;
    }
    sessionStorage.removeItem("oauth_discord_state");

    const { intent } = JSON.parse(atob(raw));
    const exchange = async () => {
      try {
        const response = await fetch("/api/auth/discord/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, intent }),
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok) {
          toast.error(`Error: ${data.error}`)
          return;
        }

        await refresh();
        navigate("/");
      } catch (error) {
        toast.error(`Error: ${(error as Error).message}`)
        navigate("/home");
      }
    };

    exchange();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
    </div>
  );
};

export default DiscordCallback;