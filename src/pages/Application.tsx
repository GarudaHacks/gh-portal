import { useState } from "react";
import ApplicationIntro from "../components/ApplicationIntro";
import ApplicationNavbar from "../components/ApplicationNavbar";
import ApplicationProfile from "@/components/ApplicationProfile";
import ApplicationInquiry from "@/components/ApplicationInquiry";
import ApplicationAdditionalQuestion from "@/components/ApplicationAdditionalQuestion";
import ApplicationSubmitted from "@/components/ApplicationSubmitted";

export enum APPLICATION_STATES {
  INTRO = "Intro",
  PROFILE = "Your Profile",
  INQUIRY = "Application Questions",
  ADDITIONAL_QUESTION = "Additional Questions",
  SUBMITTED = "Submitted",
}

const APPLICATION_STATES_ARRAY = Object.values(APPLICATION_STATES);

function Application() {
  const [applicationState, setApplicationState] = useState(APPLICATION_STATES.INTRO);

  const toNextState = () => {
    const currentIndex = APPLICATION_STATES_ARRAY.indexOf(applicationState);
    if (currentIndex < APPLICATION_STATES_ARRAY.length - 1) {
      setApplicationState(APPLICATION_STATES_ARRAY[currentIndex + 1]);
    }
  };

  const toPreviousState = () => {
    const currentIndex = APPLICATION_STATES_ARRAY.indexOf(applicationState);
    if (currentIndex > 0) {
      setApplicationState(APPLICATION_STATES_ARRAY[currentIndex - 1]);
    }
  };

  return (
    <div className="">
      <div>
        <ApplicationNavbar applicationState={applicationState} onPrevClick={toPreviousState}/>
      </div>

      <div className=" container mx-auto flex items-center justify-center w-full max-w-4xl">
        {applicationState === APPLICATION_STATES.INTRO ? <ApplicationIntro onNextClick={toNextState} /> : null}
        {applicationState === APPLICATION_STATES.PROFILE ? <ApplicationProfile applicationState={applicationState} onNextClick={toNextState} /> : null}
        {applicationState === APPLICATION_STATES.INQUIRY ? <ApplicationInquiry applicationState={applicationState} onPrevClick={toPreviousState} onNextClick={toNextState} /> : null}
        {applicationState === APPLICATION_STATES.ADDITIONAL_QUESTION ? <ApplicationAdditionalQuestion applicationState={applicationState} onPrevClick={toPreviousState} onNextClick={toNextState} /> : null}
        {applicationState === APPLICATION_STATES.SUBMITTED ? <ApplicationSubmitted /> : null}
      </div>
    </div>
  );
}

export default Application;
