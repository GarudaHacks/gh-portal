import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { APPLICATION_STATES } from "@/pages/Application";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";

function ApplicationNavbar({
  applicationState,
  onPrevClick,
}: {
  applicationState: APPLICATION_STATES;
  onPrevClick: () => void;
}) {
  const user = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
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
              src="/images/logo/gh_logo-color.png"
              width={500}
              height={500}
              className="w-10 h-10 pointer-events-none select-none"
            />
          </Link>
        ) : null}

        {applicationState === APPLICATION_STATES.INTRO ? (
          <span className="text-md font-semibold text-center line-clamp-2">
            {user.user?.displayName}
          </span>
        ) : null}

        {applicationState !== APPLICATION_STATES.INTRO ? (
          <Button
            variant="ghost"
            className="place-self-start h-full"
            onClick={onPrevClick}
          >
            <img
              src="/images/icons/arrow_backward.svg"
              width={64}
              height={64}
              className="w-5 h-5 pointer-events-none select-none"
            />
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
          <img
            src={`/images/icons/sign_out.svg`}
            width={120}
            height={120}
            className="w-6 h-6 pointer-events-none select-none"
          />
        </Button>
      </div>

      {/* desktop */}
      <div className="hidden lg:flex flex-row items-center justify-between shadow-xs p-4 gap-4">
        <div className="flex flex-row">
          <Link to="/">
            <img
              src="/images/logo/gh_logo-color.png"
              width={500}
              height={500}
              className="w-20 h-20 pointer-events-none select-none"
            />
          </Link>
          <div className="hidden lg:flex flex-col justify-center">
            <h1 className="text-2xl text-primary font-bold">
              Apply to Garuda Hacks 6.0
            </h1>
            <p className="text-xl text-primary">
              Join hundreds of hackers at SEA's largest hackathon.
            </p>
          </div>
        </div>

        <div className="flex-1 block"></div>

        <span className="text-xl font-semibold">{user.user?.displayName}</span>

        <Button className="flex" size="lg" onClick={handleLogout}>
          Logout
          <img
            src="/images/icons/sign_out_white.svg"
            width={64}
            height={64}
            className="w-4 h-4 pointer-events-none select-none"
          />
        </Button>
      </div>
    </>
  );
}

export default ApplicationNavbar;
