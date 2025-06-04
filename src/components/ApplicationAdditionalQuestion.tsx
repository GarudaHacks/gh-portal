import { ApplicationQuestion } from "@/types/application";
import { Button } from "./ui/button";
import { renderQuestion } from "@/lib/application-utils";
import { APPLICATION_STATES, LocalApplicationState } from "@/pages/Application";
import { useMemo } from "react";
import { allQuestionsData } from "@/data/questions";
import { validateResponse } from "@/lib/application-utils";
import toast from "react-hot-toast";
import { ChevronLeft, Loader2 } from "lucide-react";

export default function ApplicationAdditionalQuestion({
  localApplicationState,
  applicationState,
  onPrevClick,
  onFormChange,
  onSubmit,
  isSubmitting,
}: {
  localApplicationState: LocalApplicationState;
  applicationState: APPLICATION_STATES;
  onPrevClick: () => void;
  onFormChange: (
    questionId: string,
    type: string,
    response: any,
    error?: string
  ) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const questions = useMemo(() => {
    return (allQuestionsData as ApplicationQuestion[])
      .filter((q) => q.state === "ADDITIONAL_QUESTION")
      .sort((a, b) => a.order - b.order);
  }, []);

  const handleInputChange = (question: ApplicationQuestion, value: any) => {
    const error = validateResponse(question, value);
    onFormChange(
      question.id,
      question.type,
      value,
      error === null ? undefined : error
    );
  };

  const handleSubmitClick = async () => {
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
      onSubmit();
    } else {
      toast.error("Please correct the errors highlighted below.");
    }
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
        {questions.map(
          (q) =>
            (q.id === "referralOther"
              ? localApplicationState.data["referralSource"]?.response ===
                "Other"
              : true) && (
              <div key={q.id}>
                {renderQuestion(q, localApplicationState, handleInputChange)}
              </div>
            )
        )}
      </div>

      <Button
        className="w-full lg:w-fit place-self-end font-semibold"
        size="lg"
        onClick={handleSubmitClick}
      >
        Submit
        {isSubmitting && <Loader2 className="w-4 h-4 pointer-events-none select-none animate-spin" />}
      </Button>
    </div>
  );
}
