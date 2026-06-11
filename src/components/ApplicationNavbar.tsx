import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { APPLICATION_STATES } from "@/pages/Application";
import { ArrowLeft } from "lucide-react";
import ghLogo from "/images/logo/gh_logo-color.png"
import { eventName } from "@/config";
import { SidebarTrigger } from "./ui/sidebar";

function ApplicationNavbar({
  applicationState,
  onPrevClick,
}: {
  applicationState: APPLICATION_STATES;
  onPrevClick: () => void;
}) {
  return (
    <>
      {/* mobile */}
      <div className="grid lg:hidden grid-cols-3 place-items-center shadow-xs p-4 gap-4 h-20">
        <div className="place-self-start h-full flex items-center gap-2">
          <SidebarTrigger />
          {applicationState === APPLICATION_STATES.INTRO ? (
            <Link to="/" className="flex items-center">
              <img
                src={ghLogo}
                width={500}
                height={500}
                className="w-10 h-10 pointer-events-none select-none"
              />
            </Link>
          ) : null}
        </div>

        {applicationState !== APPLICATION_STATES.INTRO ? (
          <Button
            variant="ghost"
            className="place-self-start h-full"
            onClick={onPrevClick}
          >
            <ArrowLeft className="w-30 h-30 pointer-events-none select-none" />
          </Button>
        ) : null}

        {applicationState !== APPLICATION_STATES.INTRO ? (
          <span className="text-md font-semibold text-center line-clamp-2">
            {applicationState}
          </span>
        ) : null}
      </div>

      {/* desktop */}
      <div className="hidden lg:flex flex-row items-center justify-between shadow-xs p-4 gap-4">
        <div className="flex flex-row items-center gap-2">
          <SidebarTrigger />
          <Link to="/">
            <img
              src={ghLogo}
              width={500}
              height={500}
              className="w-20 h-20 pointer-events-none select-none"
            />
          </Link>
          <div className="hidden lg:flex flex-col justify-center">
            <h1 className="text- font-bold">
              Apply to {eventName}
            </h1>
            <p className="text-xl">
              Join hundreds of hackers at SEA's largest hackathon.
            </p>
          </div>
        </div>

        <div className="flex-1 block"></div>
      </div>
    </>
  );
}

export default ApplicationNavbar;
