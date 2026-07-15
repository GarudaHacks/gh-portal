import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Page from "../components/Page";
import HomeStatusNotRsvpd from "@/components/HomeStatusNotRsvpd";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { greetingHelper } from "@/utils/homeUtils";
import GlassyRectangleBackground from "@/components/RedGradientBackground";
import { fetchPortalConfig, PortalConfig } from "@/utils/portalConfig";
import { UserRole } from "@/types/auth";
import { UserApplicationStatus } from "@/types/applicationStatus";
import InstructionCardForMentorComponent from "@/components/InstructionCardForMentor";
import ApplyProcessCard from "./application/ApplyProcessCard";
import ApplicationSubmitted from "./application/ApplicationSubmitted";
import ApplicationAccepted from "./application/states/ApplicationAccepted";
import ApplicationConfirmedRSVP from "./application/states/ApplicationConfirmedRSVP";
import ApplicationRejected from "./application/states/ApplicationRejected";
import ApplicationCanceled from "./application/states/ApplicationCanceled";

function Home() {
  const { user, role, applicationStatus } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [portalConfig, setPortalConfig] = useState<PortalConfig | null>(null);

  useEffect(() => {
    const loadPortalConfig = async () => {
      setIsLoading(true);
      try {
        const config = await fetchPortalConfig();
        setPortalConfig(config);
      } catch (error) {
        console.error("Error loading portal config:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPortalConfig();
  }, []);

  return (
    <Page
      title="Home"
      description="View all important announcements and events here."
    >
      {isLoading ? (
        <div className="h-screen w-screen flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <>
          {role === UserRole.MENTOR ? (
            <InstructionCardForMentorComponent user={user} />
          ) : (
            <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
              {applicationStatus === UserApplicationStatus.CONFIRMED_RSVP && (
                <ApplicationConfirmedRSVP />
              )}

              {applicationStatus === UserApplicationStatus.ACCEPTED && (
                <ApplicationAccepted />
              )}

              {(applicationStatus === UserApplicationStatus.DRAFT ||
                applicationStatus === UserApplicationStatus.NOT_APPLICABLE
              ) && (
                  <ApplyProcessCard portalConfig={portalConfig} />
                )}

              {applicationStatus === UserApplicationStatus.SUBMITTED &&
                <ApplicationSubmitted portalConfig={portalConfig} />}

              {applicationStatus === UserApplicationStatus.REJECTED && (
                <ApplicationRejected />
              )}

              {applicationStatus === UserApplicationStatus.CANCELED && (
                <ApplicationCanceled />
              )}

            </div>
          )}
        </>
      )}
    </Page>
  );
}

export default Home;
