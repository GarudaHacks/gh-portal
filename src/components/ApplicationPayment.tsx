import { ApplicationQuestion } from "@/types/application";
import { Button } from "./ui/button";
import { renderQuestion } from "@/lib/application-utils";
import { APPLICATION_STATES, LocalApplicationState } from "@/pages/Application";
import { useMemo, useState, useEffect } from "react";
import { allQuestionsData } from "@/data/questions";
import { validateResponse } from "@/lib/application-utils";
import toast from "react-hot-toast";

export default function ApplicationPayment({
  localApplicationState,
  applicationState,
  onPrevClick,
  onFormChange,
  onSubmit,
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
}) {
  const [waiverChecked, setWaiverChecked] = useState(false);

  const questions = useMemo(() => {
    return (allQuestionsData as ApplicationQuestion[])
      .filter((q) => q.state === "PAYMENT")
      .sort((a, b) => a.order - b.order);
  }, []);

  const nonWaiverQuestions = questions.filter(
    (q) => !q.id.startsWith("waiver")
  );
  const waiverQuestions = questions.filter((q) => q.id.startsWith("waiver"));

  useEffect(() => {
    const waiverCheckbox = localApplicationState.data["fee_waiver"]?.response;
    setWaiverChecked(
      Array.isArray(waiverCheckbox) && waiverCheckbox.length > 0
    );
  }, [localApplicationState.data]);

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
    const questionsToValidate = waiverChecked
      ? [...nonWaiverQuestions, ...waiverQuestions]
      : nonWaiverQuestions;

    for (const q of questionsToValidate) {
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
        {nonWaiverQuestions.map((q) => (
          <div key={q.id}>
            {renderQuestion(q, localApplicationState, handleInputChange)}
          </div>
        ))}

        {waiverChecked && (
          <div className="mt-4 border-t border-gray-200 flex flex-col gap-6 pt-4">
            {waiverQuestions.map((q) => (
              <div key={q.id}>
                {renderQuestion(q, localApplicationState, handleInputChange)}
              </div>
            ))}
          </div>
        )}
      </div>

      <Button
        className="w-full lg:w-fit place-self-end font-semibold"
        size="lg"
        onClick={handleSubmitClick}
      >
        Submit
      </Button>
    </div>
  );
}
