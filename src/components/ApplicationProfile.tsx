import { ApplicationQuestion } from "@/types/application";
import { Button } from "./ui/button";
import { renderQuestion } from "@/lib/application-utils";
import { APPLICATION_STATES } from "@/pages/Application";

const dummies: ApplicationQuestion[] = [
  {
    id: "profile0",
    text: "First Name",
    type: "string",
  },
  {
    id: "profile1",
    text: "Last Name",
    type: "string",
  },
  {
    id: "profile2",
    text: "Preferred Name",
    type: "string",
  },
];

export default function ApplicationProfile({
  applicationState,
  onNextClick,
}: {
  applicationState: APPLICATION_STATES;
  onNextClick: () => void;
}) {
  return (
    <div className="p-4 flex flex-col items-center gap-4 lg:gap-6 w-full">
      <h1 className="hidden lg:flex text-3xl text-primary font-bold text-start w-full">
        {applicationState}
      </h1>
      <div className="w-full py-4 flex flex-col gap-4">
        {dummies.map((q, index) => (
          <div key={index}>{renderQuestion(q)}</div>
        ))}
      </div>

      <Button
        className="w-full lg:w-fit place-self-end font-semibold"
        onClick={onNextClick}
        size="lg"
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
