import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { APPLICATION_STATES } from "@/pages/Application";
import { ArrowLeft, LogOut } from "lucide-react";

function ApplicationNavbar({
  applicationState,
  onPrevClick,
}: {
  applicationState: APPLICATION_STATES;
  onPrevClick: () => void;
}) {
  const {user, signOut} = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* mobile */}
      <div className="grid lg:hidden grid-cols-3 place-items-center shadow-xs p-4 gap-4 h-20">
        {applicationState === APPLICATION_STATES.INTRO ? (
          <Link to="/" className="place-self-start h-full flex items-center">
            <img
              src="/images/logo/gh_logo.svg"
              width={500}
              height={500}
              className="w-10 h-10 pointer-events-none select-none"
            />
          </Link>
        ) : null}

        {applicationState === APPLICATION_STATES.INTRO ? (
          <span className="text-md font-semibold text-center line-clamp-2">
            {user?.displayName}
          </span>
        ) : null}

        {applicationState !== APPLICATION_STATES.INTRO ? (
          <Button
            variant="ghost"
            className="place-self-start h-full"
            onClick={onPrevClick}
          >
            <ArrowLeft className="w-30 h-30 pointer-events-none select-none text-white" />
          </Button>
        ) : null}

        {applicationState !== APPLICATION_STATES.INTRO ? (
          <span className="text-md font-semibold text-center line-clamp-2">
            {applicationState}
          </span>
        ) : null}

        <Button
          className="place-self-end h-full"
          variant="ghost"
          onClick={handleLogout}
        >
          <LogOut className="w-30 h-30 pointer-events-none select-none text-white" />
        </Button>
      </div>

      {/* desktop */}
      <div className="hidden lg:flex flex-row items-center justify-between shadow-xs p-4 gap-4">
        <div className="flex flex-row">
          <Link to="/">
            <img
              src="/images/logo/gh_logo.svg"
              width={500}
              height={500}
              className="w-20 h-20 pointer-events-none select-none"
            />
          </Link>
          <div className="hidden lg:flex flex-col justify-center text-white">
            <h1 className="text- font-bold">
              Apply to Garuda Hacks 6.0
            </h1>
            <p className="text-xl">
              Join hundreds of hackers at SEA's largest hackathon.
            </p>
          </div>
        </div>

        <div className="flex-1 block"></div>

        <span className="text-xl font-semibold text-white">{user?.displayName}</span>

        <Button className="flex" size="lg" onClick={handleLogout}>
          <img
            src="/images/icons/sign_out_white.svg"
            width={64}
            height={64}
            className="w-4 h-4 pointer-events-none select-none"
            />
            Logout
        </Button>
      </div>
    </>
  );
}

export default ApplicationNavbar;
