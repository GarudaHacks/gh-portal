import { ApplicationQuestion } from "@/types/application";
import { Button } from "../../components/ui/button";
import { renderQuestion, validateResponse } from "@/lib/application-utils";
import { APPLICATION_STATES, LocalApplicationState } from "@/pages/Application";
import { useMemo } from "react";
import { allQuestionsData } from "@/data/questions";
import { ChevronLeft, InfoIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const current = "APPLICATION"

export default function ApplicationApplication({
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
  onFormChange: (
    questionId: string,
    type: string,
    response: any,
    error?: string
  ) => void;
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
      .filter((q) => q.state === current)
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

  return (
    <div className="p-4 flex flex-col items-center gap-4 lg:gap-6 w-full">
      <Button
        className="hidden lg:flex w-full lg:w-fit place-self-start font-semibold"
        onClick={onPrevClick}
        variant="outline"
      >
        <ChevronLeft />
        Back
      </Button>
      <h1 className="hidden lg:block text-3xl font-bold text-start w-full">
        {applicationState}
      </h1>

      {localApplicationState.data["teamFormation"]?.response !== "No, I do not have a complete team, but I would like to look for a team through Speed Dating" && (
        <div>
          <Alert className="min-w-full border-accent bg-accent/15">
            <InfoIcon />
            <AlertTitle>Note on Registering as a Team</AlertTitle>
            <AlertDescription className="min-w-full">
              If you already have a team, every individual member of the team needs to submit this form, however teams may use the same responses to the essay questions. The final team composition will be noted during the submission of the project.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="w-full  flex flex-col gap-4">
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
