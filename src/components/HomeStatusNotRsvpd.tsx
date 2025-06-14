import { useState, useEffect } from "react";
import GlassyRectangleBackground from "./RedGradientBackground";
import { fetchPortalConfig, PortalConfig } from "@/utils/portalConfig";
import { format } from "date-fns";

export default function HomeStatusNotRsvpd() {
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
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-primary">
        Your Application Status
      </h1>
      <GlassyRectangleBackground>
        <p>Your application is being reviewed.</p>
        <p>
          We will release acceptances on a rolling basis starting from{" "}
          {portalConfig
            ? format(portalConfig.applicationReleaseDate, "MMM d, yyyy")
            : "Jun 20th, 2025"}
          .
        </p>
      </GlassyRectangleBackground>
    </div>
  );
}
