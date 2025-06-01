import { useState, useEffect } from "react";
import { applicationIntro } from "@/assets/eventData";
import GlassyRectangleBackground from "./RedGradientBackground";
import { Button } from "./ui/button";
import { fetchPortalConfig, PortalConfig } from "@/utils/portalConfig";
import { format } from "date-fns";

interface ApplicationIntroProps {
  onNextClick: () => void;
}

export default function ApplicationIntro({
  onNextClick,
}: ApplicationIntroProps) {
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
        <h1 className="text-2xl font-bold">We're glad you're here.</h1>
        <p style={{ whiteSpace: "pre-line" }}>{applicationIntro}</p>
        <div>
          {/* TODO: Need to fix this */}
          {/* <p>
            <span className="font-bold">Date:</span>{" "}
            {portalConfig
              ? format(portalConfig.hackathonStartDate, "MMMM d, yyyy")
              : ""}
            {" - "}
            {portalConfig
              ? format(portalConfig.hackathonEndDate, "MMMM d, yyyy")
              : ""}
          </p>
          <p>
            <span className="font-bold">Venue:</span> Universitas Multimedia
            Nusantara
          </p> */}
          <p>Date: July 24, 2025 - July 26, 2025.</p>
          <p>Venue: Universitas Multimedia Nusantara (UMN).</p>
        </div>
      </GlassyRectangleBackground>
      <Button
        className="w-full lg:w-fit place-self-end font-semibold"
        size="lg"
        onClick={onNextClick}
      >
        Start my application
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
