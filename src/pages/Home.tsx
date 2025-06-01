import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Page from "../components/Page";
import { APPLICATION_STATUS } from "@/types/application";
import { UserApplicationStatus } from "@/types/applicationStatus";
import HomeStatusNotRsvpd from "@/components/HomeStatusNotRsvpd";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { greetingHelper } from "@/utils/homeUtils";
import GlassyRectangleBackground from "@/components/RedGradientBackground";
import { fetchPortalConfig, PortalConfig } from "@/utils/portalConfig";

function Home() {
  const user = useAuth();
  const navigate = useNavigate();

  const [userApplicationStatus, setUserApplicationStatus] =
    useState<APPLICATION_STATUS>(APPLICATION_STATUS.DRAFT);
  const [isLoading, setIsLoading] = useState(true);
  const [portalConfig, setPortalConfig] = useState<PortalConfig | null>(null);

  const applicationsOpen =
    portalConfig?.applicationsOpen ||
    (portalConfig?.applicationStartDate &&
      new Date() >= portalConfig.applicationStartDate &&
      portalConfig?.applicationCloseDate &&
      new Date() <= portalConfig.applicationCloseDate);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/application/status", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();
        if (data.data === APPLICATION_STATUS.SUBMITTED) {
          setUserApplicationStatus(APPLICATION_STATUS.SUBMITTED);
        } else if (data.data === APPLICATION_STATUS.ACCEPTED) {
          setUserApplicationStatus(APPLICATION_STATUS.ACCEPTED);
        }
      } catch (error) {
        console.error("Error fetching application status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplicationStatus();
  }, [user]);

  // Fetch portal config on component mount
  useEffect(() => {
    const loadPortalConfig = async () => {
      console.log("Home: Starting to load portal config...");
      try {
        const config = await fetchPortalConfig();
        console.log("Home: Portal config loaded:", config);
        setPortalConfig(config);
      } catch (error) {
        console.error("Home: Error loading portal config:", error);
      }
    };
    loadPortalConfig();
  }, []);

  /**
   * Counts down time to registration closing or hacking end time
   */
  useEffect(() => {
    if (!portalConfig) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const usedTime =
        now < portalConfig.applicationCloseDate.getTime()
          ? portalConfig.applicationCloseDate.getTime()
          : portalConfig.hackathonEndDate.getTime();
      const distance = usedTime - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timerInterval);
      } else {
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateTimer();

    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  }, [portalConfig]);

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
          <div className="flex flex-col gap-4">
            {user?.applicationStatus ===
              UserApplicationStatus.CONFIRMED_RSVP && (
              <>
                <div className="flex flex-col gap-4">
                  <h1 className="text-3xl lg:text-5xl font-bold text-white">
                    {greetingHelper()},{" "}
                    {user?.user?.first_name || user?.user?.displayName}!
                  </h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-6 flex flex-col h-full items-center justify-center gap-4">
                      <h3 className="text-xl uppercase font-semibold text-center">
                        {applicationsOpen
                          ? "APPLICATIONS CLOSE IN"
                          : "HACKING CLOSES IN"}
                      </h3>
                      <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-center">
                        <div className="flex flex-col items-center">
                          {timeLeft.hours > 100 ? (
                            <>
                              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
                                {timeLeft.days.toString().padStart(2, "0")}
                              </div>
                              <p className="">days</p>
                            </>
                          ) : (
                            <>
                              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
                                {timeLeft.hours.toString().padStart(2, "0")}
                              </div>
                              <p className="">hours</p>
                            </>
                          )}
                        </div>
                        <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
                          :
                        </div>
                        <div>
                          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold ">
                            {timeLeft.minutes.toString().padStart(2, "0")}
                          </div>
                          <p className="">minutes</p>
                        </div>
                        <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold ">
                          :
                        </div>
                        <div>
                          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold ">
                            {timeLeft.seconds.toString().padStart(2, "0")}
                          </div>
                          <p className="">seconds</p>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-6 flex flex-col h-full items-center justify-center gap-4">
                      <h3 className="text-xl uppercase font-semibold text-center">
                        Event Website
                      </h3>
                      <a
                        href="https://garudahacks.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Visit garudahacks.com
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {userApplicationStatus === APPLICATION_STATUS.SUBMITTED ? (
            <HomeStatusNotRsvpd />
          ) : null}

          {userApplicationStatus === APPLICATION_STATUS.ACCEPTED ? (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-primary">
                Congratulations! You've been accepted 🎉
              </h2>
              <GlassyRectangleBackground>
                <p>
                  You have been accepted to Garuda Hacks 6.0! Please confirm
                  your attendance by clicking the button below.
                </p>
                <Button className="w-fit" onClick={() => navigate("/ticket")}>
                  Confirm Attendance & Get Ticket
                </Button>
              </GlassyRectangleBackground>
            </div>
          ) : null}

          {userApplicationStatus === APPLICATION_STATUS.DRAFT ? (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-primary">
                Applications are{" "}
                {applicationsOpen ? "open!" : "currently closed."}
              </h2>
              <div className="flex flex-col gap-4 border-gray-600 bg-opacity-10 bg-white/5 backdrop-blur-md border-2 p-4 rounded-2xl shadow-md">
                <p className="font-medium">
                  <span className="mb-2">
                    Apply by{" "}
                    <b>
                      {portalConfig
                        ? format(portalConfig.applicationCloseDate, "MMMM d, yyyy") 
                        : ""}
                    </b>{" "}
                    for a spot at Garuda Hacks 6.0.
                  </span>
                  <br />
                  <span className="font-bold">Date:</span>{" "}
                  {portalConfig
                    ? format(portalConfig.hackathonStartDate, "MMMM d, yyyy")
                    : ""}
                  -{" "}
                  {portalConfig
                    ? format(portalConfig.hackathonEndDate, "MMMM d, yyyy")
                    : ""}
                  <br />
                  <span className="font-bold">Venue:</span> Universitas Multimedia Nusantara (UMN).
                </p>
                {(() => {
                  return (
                    <Button
                      className={`w-fit ${
                        !applicationsOpen ? "opacity-90 cursor-not-allowed" : ""
                      }`}
                      disabled={!applicationsOpen}
                      onClick={() => navigate("/application")}
                    >
                      Apply Now
                    </Button>
                  );
                })()}
              </div>
            </div>
          ) : null}
        </>
      )}
    </Page>
  );
}

export default Home;
