import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Page from "../components/Page";
import { APPLICATION_STATUS } from "@/types/application";
import HomeStatusNotRsvpd from "@/components/HomeStatusNotRsvpd";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { greetingHelper } from "@/utils/homeUtils";
import GlassyRectangleBackground from "@/components/RedGradientBackground";
import { fetchPortalConfig, PortalConfig } from "@/utils/portalConfig";
import { UserRole } from "@/types/auth";
import InstructionCardForMentorComponent from "@/components/InstructionCardForMentor";

function Home() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [userApplicationStatus, setUserApplicationStatus] =
    useState<APPLICATION_STATUS>(APPLICATION_STATUS.DRAFT);
  const [isLoading, setIsLoading] = useState(true);
  const [portalConfig, setPortalConfig] = useState<PortalConfig | null>(null);

  // Force applications closed
  const applicationsOpen = false;

  // const [timeLeft, setTimeLeft] = useState({
  //   days: 0,
  //   hours: 0,
  //   minutes: 0,
  //   seconds: 0,
  // });

  useEffect(() => {
    const fetchApplicationStatus = async () => {
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
        } else if (data.data === APPLICATION_STATUS.CONFIRMED_RSVP) {
          setUserApplicationStatus(APPLICATION_STATUS.CONFIRMED_RSVP);
        } else if (data.data === APPLICATION_STATUS.REJECTED) {
          setUserApplicationStatus(APPLICATION_STATUS.REJECTED);
        }
      } catch (error) {
        console.error("Error fetching application status:", error);
      }
    };

    const loadPortalConfig = async () => {
      try {
        const config = await fetchPortalConfig();
        setPortalConfig(config);
      } catch (error) {
        console.error("Error loading portal config:", error);
      }
    };

    const initializeData = async () => {
      setIsLoading(true);
      await Promise.all([fetchApplicationStatus(), loadPortalConfig()]);
      setIsLoading(false);
    };

    initializeData();
  }, [user]);

  /**
   * Counts down time to registration closing or hacking end time
   */
  useEffect(() => {
    if (!portalConfig) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      // const usedTime = portalConfig.hackathonEndDate.getTime();
      // const distance = usedTime - now;

      // const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      // const hours = Math.floor(distance / (1000 * 60 * 60));
      // const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      // const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // if (distance <= 0) {
      //   setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      //   clearInterval(timerInterval);
      // } else {
      //   setTimeLeft({ days, hours, minutes, seconds });
      // }
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
          {role === UserRole.MENTOR ? (
            <InstructionCardForMentorComponent user={user} />
          ) : (
            <>
              <div className="flex flex-col gap-4">
                {userApplicationStatus === APPLICATION_STATUS.CONFIRMED_RSVP && (
                  <>
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
                          {/* <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-center">
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
                          </div> */}
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
                    <Button
                      className="w-fit mt-4"
                      onClick={() => navigate("/rsvp")}
                    >
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
                            ? format(
                              portalConfig.applicationCloseDate,
                              "MMMM d, yyyy"
                            )
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
                      <span className="font-bold">Venue:</span> Universitas
                      Multimedia Nusantara (UMN).
                    </p>
                    {(() => {
                      return (
                        <Button
                          className={`w-fit ${!applicationsOpen ? "opacity-90 cursor-not-allowed" : ""
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

              {userApplicationStatus === APPLICATION_STATUS.REJECTED ? (
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
              ) : null}
            </>
          )}
        </>
      )}
    </Page>
  );
}

export default Home;
