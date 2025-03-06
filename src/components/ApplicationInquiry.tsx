import { ApplicationQuestion } from "@/types/application";
import { Button } from "./ui/button";
import { renderQuestion } from "@/lib/application-utils";
import { APPLICATION_STATES } from "@/pages/Application";

const dummies: ApplicationQuestion[] = [
  {
    id: "inquiry0",
    text: "How many hackathons have you been to before?",
    type: "number",
  },
  {
    id: "inquiry1",
    text: "What roles would you like to take in a hackathon?",
    type: "string",
  },
  {
    id: "inquiry2",
    text: "Please upload your resume.",
    type: "file",
  },
  {
    id: "inquiry3",
    text: "What motivates you to build in Garuda Hacks? Please provide a response within 150 words.",
    type: "textarea",
  },
  {
    id: "inquiry4",
    text: "Share an interesting project you've previously worked on. It doesn't have to be technical! Please provide a response within 150 words.",
    type: "textarea",
  },
];

export default function ApplicationInquiry({
  applicationState,
  onNextClick,
  onPrevClick,
}: {
  applicationState: APPLICATION_STATES;
  onNextClick: () => void;
  onPrevClick: () => void;
}) {
  return (
    <div className="p-4 flex flex-col items-center gap-4 lg:gap-6 w-full">
      <Button
        className="hidden lg:flex w-full lg:w-fit place-self-start font-semibold"
        onClick={onPrevClick}
        variant="outline"
      >
        <img
          src="/images/icons/arrow_back_ios.svg"
          width={48}
          height={48}
          className="w-4 h-4 pointer-events-none select-none"
        />
        Back
      </Button>
      <h1 className="hidden lg:block text-3xl text-primary font-bold text-start w-full">
        {applicationState}
      </h1>
      <div className="w-full py-4 flex flex-col gap-4">
        {dummies.map((q, index) => (
          <div key={index}>{renderQuestion(q)}</div>
        ))}
      </div>

      <Button
        className="w-full lg:w-fit place-self-end font-semibold"
        size="lg"
        onClick={onNextClick}
      >
        Continue
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
