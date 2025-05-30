import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Page from "../components/Page";
import { APPLICATION_STATUS } from "@/types/application";
import HomeStatusNotRsvpd from "@/components/HomeStatusNotRsvpd";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { dates } from "@/assets/data/copywriting";
import { format } from "date-fns";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { greetingHelper } from "@/utils/homeUtils";
import GlassyRectangleBackground from "@/components/RedGradientBackground";

function Home() {
  const user = useAuth();
  const navigate = useNavigate();

  const [userApplicationStatus, setUserApplicationStatus] =
    useState<APPLICATION_STATUS>(APPLICATION_STATUS.DRAFT);
  const [isLoading, setIsLoading] = useState(true);

  const devTesting = true;
  const applicationsOpen = devTesting ? true : new Date(dates.applicationOpenDate) < new Date() && new Date(dates.applicationCloseDate) > new Date();

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

  /**
   * Counts down time to registration closing or hacking end time
   */
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const usedTime =
        now < new Date(dates.applicationCloseDate).getTime() ? new Date(dates.applicationCloseDate).getTime() : new Date(dates.hackathonEndDate).getTime();
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
  }, []);

  return (
    <Page
      title="Home"
      description="View all important announcements and events here."
    >
      {isLoading ? (
        <Loader2 className="animate-spin h-8-w-8 text-white" />
      ) : (
        <>
          {userApplicationStatus === APPLICATION_STATUS.SUBMITTED ? (
            <HomeStatusNotRsvpd />
          ) : null}

          {userApplicationStatus === APPLICATION_STATUS.ACCEPTED ? (
            <GlassyRectangleBackground>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-center text-3xl font-semibold">
                  <h2 className="text-balance">{greetingHelper()}, {user.user?.displayName}! 👋</h2>
                  <div className="flex flex-col w-full lg:w-fit lg:flex-row gap-4">
                    <Button className="group" variant={"outline"}>
                      View event booklet
                      <ArrowUpRight />
                    </Button>
                    <Button className="" variant={"outline"}>
                      Judging Schedule
                    </Button>
                  </div>
                </div>

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
                        <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
                          {timeLeft.seconds.toString().padStart(2, "0")}
                        </div>
                        <p className="">seconds</p>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg flex flex-col p-6 gap-4">
                    <h3 className="text-2xl font-semibold text-center">
                      Judging Information
                    </h3>
                    <p className="mb-2 text-sm">
                      Submissions for Garuda Hacks 6.0 will be handled on{" "}
                      <a
                        href="#"
                        className="text-primary font-semibold hover:underline"
                      >
                        Devpost
                      </a>
                      !
                    </p>
                    <p className="mb-4 text-sm">
                      Please read the{" "}
                      <a
                        href="#"
                        className="text-primary font-semibold hover:underline"
                      >
                        Submission Guidelines
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-primary font-semibold hover:underline"
                      >
                        Judging Instructions and FAQ
                      </a>{" "}
                      before submitting.
                    </p>
                    <p className="text-sm">
                      Check back here after hacking period has ended for your judging
                      information and time.
                    </p>
                  </div>
                </div>
              </div>
            </GlassyRectangleBackground>
          ) : null}

          {userApplicationStatus === APPLICATION_STATUS.DRAFT ? (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-primary">
                Applications are {applicationsOpen ? "open!" : "currently closed."}
              </h2>
              <div className="flex flex-col gap-4 border-gray-600 bg-opacity-10 bg-white/5 backdrop-blur-md border-2 p-4 rounded-2xl shadow-md">
                <p className="font-medium">
                  <span className="mb-2">Apply by <b>{format(new Date(dates.applicationCloseDate), "MMMM d, yyyy")}</b> for a spot at Garuda Hacks 6.0.</span>
                  <br />
                  <span className="font-bold">Date:</span>{" "}
                  {format(new Date(dates.hackathonStartDate), "MMMM d, yyyy")} -{" "}
                  {format(new Date(dates.hackathonEndDate), "MMMM d, yyyy")}.
                  <br />
                  <span className="font-bold">Venue:</span> Universitas Multimedia Nusantara (UMN).
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
        </>
      )}
    </Page>
  );
}

export default Home;
