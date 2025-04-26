import {ApplicationQuestion} from "@/types/application";
import {Button} from "./ui/button";
import {renderQuestion} from "@/lib/application-utils";
import {APPLICATION_STATES, LocalApplicationState} from "@/pages/Application";
import {useEffect, useState} from "react";

export default function ApplicationProfile({
  localApplicationState,
  applicationState,
  onNextClick,
  onFormChange,
}: {
  localApplicationState: LocalApplicationState;
  applicationState: APPLICATION_STATES;
  onNextClick: () => void;
  onFormChange: (questionId: string, type: string, response: any) => void;
}) {
  const [questions, setQuestions] = useState<ApplicationQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/application/questions?state=PROFILE", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }

        const data = await response.json();
        setQuestions(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch questions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleInputChange = (question: ApplicationQuestion, value: any) => {
    onFormChange(question.id, question.type, value);
  };

  if (isLoading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 flex flex-col items-center gap-4 lg:gap-6 w-full">
      <h1 className="hidden lg:flex text-3xl text-primary font-bold text-start w-full">
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
