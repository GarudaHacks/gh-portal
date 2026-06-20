import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { fetchPortalConfig, PortalConfig } from "@/utils/portalConfig";
import { eventName } from "@/config";
import garudieLaptop from "/assets/garudie-laptop.png"

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
    <div className="p-4 flex flex-col items-center justify-center gap-4 lg:gap-6 w-full">
      <div className="">
        <div className="flex flex-col items-center w-full">
          <img src={garudieLaptop} width={300} height={300} className="w-52 lg:w-64" />
        </div>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Thank you for your interest in participating in {eventName}!</h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          As an organization committed to providing quality competition to students worldwide, we are proud to welcome thousands of students from various countries, fostering global learning opportunities. Thus, we need some of your information to ensure that we are able to provide you with the best hackathon experience.
          <br /><br />
          Please answer all questions honestly! Although Garuda Hacks 7.0 tries to accommodate all participants, we are unable to accept all participants due to limited capacity.
          <br /><br />
          For more information, please visit our website <a href="https://garudahacks.com" className="underline">garudahacks.com</a>, our Instagram page <a href="https://www.instagram.com/garudahacks/" className="underline">@garudahacks</a>, or please contact <a href="mailto:ben@garudahacks.com" className="underline">ben@garudahacks.com</a>.
          <br /><br />
          Start your registration now, whether you're flying <b>solo</b> or rolling with <b>a team of up to 4!</b>
        </p>
      </div>
      <Button
        className="w-full lg:w-fit place-self-end font-semibold"
        size="lg"
        onClick={onNextClick}
      >
        Apply
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
