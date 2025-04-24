import { applicationIntro } from "@/assets/data/copywriting";
import RedGradientBackground from "./RedGradientBackground";
import { Button } from "./ui/button";

interface ApplicationIntroProps {
  onNextClick: () => void;
}

export default function ApplicationIntro({
  onNextClick,
}: ApplicationIntroProps) {
  return (
    <div className="p-4 flex flex-col items-center gap-4 lg:gap-6 w-full">
      <RedGradientBackground className="w-full p-4 rounded-2xl flex flex-col gap-4 text-white shadow-md">
        <h1 className="text-2xl font-bold">We're glad you're here.</h1>
        <p>{applicationIntro}</p>
        <div>
          <p>Date:</p>
          <p>Venue:</p>
        </div>
      </RedGradientBackground>
      <Button className="w-full lg:w-fit place-self-end font-semibold" size="lg" onClick={onNextClick}>
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
