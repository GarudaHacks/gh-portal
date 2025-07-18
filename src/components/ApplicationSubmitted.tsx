import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlassyRectangleBackground from "./RedGradientBackground";
import { Button } from "./ui/button";
import { fetchPortalConfig, PortalConfig } from "@/utils/portalConfig";
import { format } from "date-fns";

export default function ApplicationSubmitted() {
  const navigate = useNavigate();
  const [portalConfig, setPortalConfig] = useState<PortalConfig | null>(null);

  useEffect(() => {
    const loadPortalConfig = async () => {
      try {
        const config = await fetchPortalConfig();
        setPortalConfig(config);
      } catch (error) {
        console.error("Error loading portal config:", error);
      }
    };
    loadPortalConfig();
  }, []);

  return (
    <div className="p-4 flex flex-col items-center gap-4 lg:gap-6 w-full">
      <GlassyRectangleBackground className="w-full p-4 rounded-2xl flex flex-col gap-4 text-white shadow-md">
        <h1 className="text-2xl font-bold">Hooray! Thanks for applying.</h1>

        <p>Your application has been submitted.</p>

        <p>
          We will release decisions on a rolling basis starting from{" "}
          {portalConfig
            ? format(portalConfig.applicationReleaseDate, "MMM d yyyy")
            : "Jun 25th 2025"}
          . Stay tuned for any emails from us!
        </p>
      </GlassyRectangleBackground>

      <Button
        className="w-full lg:w-fit place-self-end font-semibold"
        size="lg"
        onClick={() => navigate("/home")}
      >
        Go to dashboard
        <img
          src="/images/icons/arrow_forward.svg"
          width={48}
          height={48}
          className="w-4 h-4 pointer-events-none select-none"
        />
      </Button>
    </div>
  );
}
