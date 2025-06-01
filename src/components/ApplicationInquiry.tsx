import { ApplicationQuestion } from "@/types/application";
import { Button } from "./ui/button";
import { renderQuestion, validateResponse } from "@/lib/application-utils";
import { APPLICATION_STATES, LocalApplicationState } from "@/pages/Application";
import { useMemo } from "react";
import { allQuestionsData } from "@/data/questions";
import { ChevronLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ApplicationInquiry({
  localApplicationState,
  applicationState,
  onNextClick,
  onPrevClick,
  onFormChange,
  isSubmitting,
}: {
  localApplicationState: LocalApplicationState;
  applicationState: APPLICATION_STATES;
  onNextClick: () => void;
  onPrevClick: () => void;
  onFormChange: (questionId: string, type: string, response: any, error?: string) => void;
  isSubmitting: boolean;
}) {

  const handleNextClick = async () => {
    let allValid = true;
    for (const q of questions) {
      const value = localApplicationState.data[q.id]?.response;
      const errorMessage = validateResponse(q, value);
      if (errorMessage) {
        allValid = false;
      }
      onFormChange(
        q.id,
        q.type,
        value,
        errorMessage === null ? undefined : errorMessage
      );
    }

    if (allValid) {
      onNextClick();
    } else {
      toast.error("Please correct the errors highlighted below.");
    }
  };

  const questions = useMemo(() => {
    return (allQuestionsData as ApplicationQuestion[])
      .filter((q) => q.state === "INQUIRY")
      .sort((a, b) => a.order - b.order);
  }, []);

  const handleInputChange = (question: ApplicationQuestion, value: any) => {
    onFormChange(question.id, question.type, value, "");
  };

  return (
    <div className="p-4 flex flex-col items-center gap-4 lg:gap-6 w-full">
      <Button
        className="hidden lg:flex w-full lg:w-fit place-self-start font-semibold text-white"
        onClick={onPrevClick}
        variant="outline"
      >
        <ChevronLeft />
        Back
      </Button>
      <h1 className="hidden lg:block text-3xl text-white font-bold text-start w-full">
        {applicationState}
      </h1>
      <div className="w-full py-4 flex flex-col gap-4">
        {questions.map((q, index) => (
          <div key={index}>
            {renderQuestion(q, localApplicationState, handleInputChange)}
          </div>
        ))}
      </div>

      <Button
        className="w-full lg:w-fit place-self-end font-semibold"
        onClick={handleNextClick}
        size="lg"
      >
        Continue
        {!isSubmitting ? (
          <img
            src="/images/icons/arrow_forward.svg"
            width={48}
            height={48}
            className="w-4 h-4 pointer-events-none select-none"
          />
        ) : (
          <Loader2 className="w-4 h-4 pointer-events-none select-none animate-spin" />
        )}
      </Button>
    </div>
  );
}
