import { ApplicationQuestion } from "@/types/application";
import { Button } from "./ui/button";
import { renderQuestion } from "@/lib/application-utils";
import { APPLICATION_STATES, LocalApplicationState } from "@/pages/Application";
import { useMemo } from "react";
import allQuestionsData from "@/data/questions.json";

export default function ApplicationAdditionalQuestion({
  localApplicationState,
  applicationState,
  onPrevClick,
  onFormChange,
  onSubmit,
}: {
  localApplicationState: LocalApplicationState;
  applicationState: APPLICATION_STATES;
  onPrevClick: () => void;
  onFormChange: (questionId: string, type: string, response: any) => void;
  onSubmit: () => void;
}) {
  const questions = useMemo(() => {
    return (allQuestionsData as ApplicationQuestion[])
      .filter((q) => q.category === "INQUIRY")
      .sort((a, b) => a.order - b.order);
  }, []);

  const handleInputChange = (question: ApplicationQuestion, value: any) => {
    onFormChange(question.id, question.type, value);
  };

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
        {questions.map((q) => (
          <div key={q.id}>
            {renderQuestion(q, localApplicationState, handleInputChange)}
          </div>
        ))}
      </div>

      <Button
        className="w-full lg:w-fit place-self-end font-semibold"
        size="lg"
        onClick={onSubmit}
      >
        Submit
      </Button>
    </div>
  );
}
