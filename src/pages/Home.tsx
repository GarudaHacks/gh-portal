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
import ApplyNow from "./application/ApplyNow";

function Home() {
  const { user, role, applicationStatus } = useAuth();
  const navigate = useNavigate();

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
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4">
                    <h1 className="text-3xl lg:text-5xl font-bold text-white">
                      {greetingHelper()},{" "}
                      {user?.first_name || user?.displayName}!
                    </h1>
                    <h2 className="text-3xl lg:text-3xl mb-4 font-bold text-white">
                      See you at Garuda Hacks 6.0!
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-6 flex flex-col h-full items-center justify-center gap-4">
                        <h3 className="text-xl uppercase font-semibold text-center">
                          HACKING ENDED 🎉
                        </h3>
                      </div>

                      <div className="border rounded-lg p-6 flex flex-col h-full items-center justify-center gap-4">
                        <h3 className="text-xl uppercase font-semibold text-center">
                          Discord Server
                        </h3>
                        <a
                          href="https://discord.gg/vQw3UeYzFb"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Join Discord server
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {applicationStatus === UserApplicationStatus.SUBMITTED && (
                <HomeStatusNotRsvpd />
              )}

              {applicationStatus === UserApplicationStatus.ACCEPTED && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl font-bold text-primary">
                    Congratulations! You've been accepted 🎉
                  </h2>
                  <GlassyRectangleBackground>
                    <p>
                      You have been accepted to Garuda Hacks 6.0! Please confirm
                      your attendance by clicking the button below.
                    </p>
                    <Button
                      className="w-fit mt-4"
                      onClick={() => navigate("/rsvp")}
                    >
                      Confirm Attendance & Get Ticket
                    </Button>
                  </GlassyRectangleBackground>
                </div>
              )}

              {applicationStatus === UserApplicationStatus.DRAFT && (
                <ApplyNow portalConfig={portalConfig} />
              )}

              {applicationStatus === UserApplicationStatus.REJECTED && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl font-bold text-red-500">
                    Application Status: Rejected
                  </h2>
                  <GlassyRectangleBackground>
                    <div className="flex flex-col gap-4">
                      <h3 className="text-xl font-semibold text-white">
                        Thank you for applying
                      </h3>
                      <p className="text-gray-300">
                        We appreciate your interest in Garuda Hacks 6.0. After
                        careful consideration, we regret to inform you that we are
                        unable to offer you a spot this year.
                      </p>
                      <p className="text-gray-300">
                        The selection process was highly competitive, and we
                        encourage you to apply again next year. Thank you for your
                        passion and effort!
                      </p>
                    </div>
                  </GlassyRectangleBackground>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </Page>
  );
}

export default Home;
