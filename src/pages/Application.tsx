import { useEffect, useRef, useState } from "react";
import ApplicationIntro from "./application/ApplicationIntro";
import ApplicationNavbar from "./application/ApplicationNavbar";
import ApplicationProfile from "@/pages/application/ApplicationProfile";
import ApplicationAdditionalQuestion from "@/pages/application/ApplicationAdditionalQuestion";
import { APPLICATION_STATUS } from "@/types/application";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { getStateKey } from "@/utils/applicationUtils";
import { parse } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import ApplicationApplication from "./application/ApplicationApplication";
import ApplicationTeam from "./application/ApplicationTeam";
import { allQuestionsData } from "@/data/questions";
import { ApplicationQuestion } from "@/types/application";
import ApplicationSpeedDating from "./application/ApplicationSpeedDating";
import ApplicationLogistic from "./application/ApplicationLogistic";
import ApplicationEmergency from "./application/ApplicationEmergency";
import ContactSupport from "@/components/ContactSupport";
import ApplicationSubmittedForm from "./application/ApplicationSubmittedForm";

export enum APPLICATION_STATES {
  INTRO = "Intro",
  PROFILE = "Your Profile",
  TEAM = "Team",
  SPEED_DATING = "Speed Dating",
  APPLICATION = "Application",
  LOGISTICAL_DETAIL = "Logistic Information",
  EMERGENCY_AND_CONSENT = "Emergency Information",
  ADDITIONAL_QUESTION = "Additional Questions",
  SUBMITTED = "Submitted",
}

const APPLICATION_STATES_ARRAY = Object.values(APPLICATION_STATES);

const SPEED_DATING_OPTION =
  "No, I do not have a complete team, but I would like to look for a team through Speed Dating";

const SPEED_DATING_QUESTION_IDS = new Set(
  (allQuestionsData as ApplicationQuestion[])
    .filter((q) => q.state === "SPEED_DATING")
    .map((q) => q.id)
);

const BASE_STEP_STATES = [
  APPLICATION_STATES.PROFILE,
  APPLICATION_STATES.TEAM,
  APPLICATION_STATES.SPEED_DATING,
  APPLICATION_STATES.APPLICATION,
  APPLICATION_STATES.LOGISTICAL_DETAIL,
  APPLICATION_STATES.EMERGENCY_AND_CONSENT,
  APPLICATION_STATES.ADDITIONAL_QUESTION,
];

export interface LocalApplicationState {
  latestState: APPLICATION_STATES;
  data: {
    [key: string]: {
      id: string;
      type: string;
      response: any;
      error: string;
    };
  };
  lastUpdated: Date;
}

type ValidationError = { field_id: string; message: string };

const buildFormResponse = (data: LocalApplicationState["data"]) => {
  const formResponse: { [key: string]: any } = {};
  for (const questionId in data) {
    const question = data[questionId];
    const { response } = question;
    if (question.type === "file") {
      formResponse[questionId] = response?.name;
    } else if (question.type === "datetime") {
      try {
        let parsedDate: Date | null = null;
        if (response instanceof Date) {
          parsedDate = response;
        } else if (typeof response === "string") {
          parsedDate = parse(response, "MM/dd/yyyy", new Date());
          if (parsedDate.toString() === "Invalid Date") {
            const isoDate = new Date(response);
            parsedDate = isoDate.toString() !== "Invalid Date" ? isoDate : null;
          }
        }
        if (parsedDate && parsedDate.toString() !== "Invalid Date") {
          formResponse[questionId] = parsedDate.toISOString();
        }
      } catch (e) {
        console.error(`Error parsing date for question ${questionId}:`, e);
      }
    } else {
      formResponse[questionId] = response;
    }
  }
  return formResponse;
};

const applyValidationErrors = (
  currentData: LocalApplicationState["data"],
  errors: ValidationError[]
): LocalApplicationState["data"] => {
  const updatedData = { ...currentData };
  for (const { field_id, message } of errors) {
    updatedData[field_id] = {
      id: field_id,
      type: currentData[field_id]?.type,
      response: currentData[field_id]?.response,
      error: message,
    };
  }
  return updatedData;
};

function Application() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationState, setApplicationState] = useState(
    APPLICATION_STATES.INTRO
  );
  const [localApplicationState, setLocalApplicationState] =
    useState<LocalApplicationState>({
      latestState: APPLICATION_STATES.INTRO,
      data: {},
      lastUpdated: new Date(),
    });
  const isMounted = useRef(false);

  const updateFormData = (
    questionId: string,
    type: string,
    response: any,
    error?: string
  ) => {
    setLocalApplicationState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [questionId]: { id: questionId, type, response, error: error || "" },
      },
    }));
  };

  const patchApplication = async (
    state: string,
    data: LocalApplicationState["data"]
  ): Promise<{ ok: boolean; errorData?: any }> => {
    const isSpeedDating =
      data["teamFormation"]?.response === SPEED_DATING_OPTION;
    const filteredData = isSpeedDating
      ? data
      : Object.fromEntries(
        Object.entries(data).filter(([key]) => !SPEED_DATING_QUESTION_IDS.has(key))
      );
    const payload = {
      ...buildFormResponse(filteredData),
      userId: user?.uid,
      state,
    };
    try {
      const response = await fetch(`/api/application`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-xsrf-token": Cookies.get("XSRF-TOKEN") || "",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: "Unknown error occurred." };
        }
        return { ok: false, errorData };
      }
      return { ok: true };
    } catch {
      return {
        ok: false,
        errorData: { message: "Network error. Please try again." },
      };
    }
  };

  const handleValidationErrors = (errorData: any): boolean => {
    if (!errorData?.details || !Array.isArray(errorData.details)) return false;
    setLocalApplicationState((prev) => ({
      ...prev,
      data: applyValidationErrors(prev.data, errorData.details),
    }));
    const errorMessages = errorData.details
      .map((e: ValidationError) => e.message)
      .filter(Boolean)
      .join("\n");
    toast.error(
      errorMessages
        ? `There are errors in your application:\n${errorMessages}`
        : "There are errors in your application."
    );
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const { ok, errorData } = await patchApplication(
      "ADDITIONAL_QUESTION",
      localApplicationState.data
    );

    if (!ok) {
      if (!handleValidationErrors(errorData)) {
        toast.error(
          errorData?.message ||
          "Failed to save application.\nPlease log out and log back in to refresh your session."
        );
      }
      setIsSubmitting(false);
      return;
    }

    setLocalApplicationState((prev) => ({ ...prev, data: {} }));
    setApplicationState(APPLICATION_STATES.SUBMITTED);
    localStorage.removeItem("localApplicationState");

    try {
      const response = await fetch(`/api/application/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-xsrf-token": Cookies.get("XSRF-TOKEN") || "",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(
          data.message ||
          "Failed to save application.\nPlease log out and log back in to refresh your session."
        );
        console.error("Error saving application data:", data);
        return;
      }
      toast.success("Application submitted!");
    } catch (error) {
      console.error("Error saving application data:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save application.\nPlease log out and log back in to refresh your session."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSpeedDatingSelected =
    localApplicationState.data["teamFormation"]?.response === SPEED_DATING_OPTION;

  const stepStates = isSpeedDatingSelected
    ? BASE_STEP_STATES
    : BASE_STEP_STATES.filter((s) => s !== APPLICATION_STATES.SPEED_DATING);

  const toNextState = async () => {
    const currentIndex = APPLICATION_STATES_ARRAY.indexOf(applicationState);
    if (currentIndex >= APPLICATION_STATES_ARRAY.length - 1) return;

    if (
      applicationState !== APPLICATION_STATES.INTRO &&
      applicationState !== APPLICATION_STATES.SUBMITTED
    ) {
      setIsSubmitting(true);
      const { ok, errorData } = await patchApplication(
        getStateKey(applicationState),
        localApplicationState.data
      );

      if (!ok) {
        if (!handleValidationErrors(errorData)) {
          toast.error(
            errorData?.message ||
            "Failed to save application.\nPlease log out and log back in to refresh your session."
          );
        }
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
    }

    let nextIndex = currentIndex + 1;
    if (
      APPLICATION_STATES_ARRAY[nextIndex] === APPLICATION_STATES.SPEED_DATING &&
      !isSpeedDatingSelected
    ) {
      nextIndex++;
    }
    const nextState = APPLICATION_STATES_ARRAY[nextIndex];
    setApplicationState(nextState);
    setLocalApplicationState((prev) => ({ ...prev, latestState: nextState }));
  };

  const toPreviousState = () => {
    const currentIndex = APPLICATION_STATES_ARRAY.indexOf(applicationState);
    if (currentIndex <= 0) return;
    let prevIndex = currentIndex - 1;
    if (
      APPLICATION_STATES_ARRAY[prevIndex] === APPLICATION_STATES.SPEED_DATING &&
      !isSpeedDatingSelected
    ) {
      prevIndex--;
    }
    const prevState = APPLICATION_STATES_ARRAY[prevIndex];
    setApplicationState(prevState);
    setLocalApplicationState((prev) => ({ ...prev, latestState: prevState }));
  };

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      const response = await fetch(`/api/application/status`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (data.data === APPLICATION_STATUS.SUBMITTED) {
        navigate("/home");
      }
    };

    fetchApplicationStatus();

    const validQuestionIds = new Set(
      (allQuestionsData as ApplicationQuestion[]).map((q) => q.id)
    );

    const saved = localStorage.getItem("localApplicationState");
    if (saved) {
      try {
        const json = JSON.parse(saved);
        if (json.lastUpdated) json.lastUpdated = new Date(json.lastUpdated);
        if (json.data) {
          json.data = Object.fromEntries(
            Object.entries(json.data).filter(([key]) => validQuestionIds.has(key))
          );
        }
        if (
          json.latestState &&
          APPLICATION_STATES_ARRAY.includes(json.latestState)
        ) {
          setApplicationState(json.latestState);
        }
        setLocalApplicationState(json);
      } catch {
        setLocalApplicationState({
          latestState: APPLICATION_STATES.INTRO,
          data: {},
          lastUpdated: new Date(),
        });
      }
    } else {
      setLocalApplicationState({
        latestState: APPLICATION_STATES.INTRO,
        data: {},
        lastUpdated: new Date(),
      });
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    localStorage.setItem(
      "localApplicationState",
      JSON.stringify({
        latestState: localApplicationState.latestState,
        data: localApplicationState.data,
        lastUpdated: new Date().toISOString(),
      })
    );
  }, [localApplicationState]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const currentStepIndex = stepStates.indexOf(applicationState);
  const isStepState = currentStepIndex !== -1;
  const totalSteps = stepStates.length;

  return (
    <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
      <div>
        <ApplicationNavbar
          applicationState={applicationState}
          onPrevClick={toPreviousState}
        />
        {isStepState && (
          <div className="px-6 py-3 border-b bg-background">
            <div className="container mx-auto max-w-4xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground font-medium">
                  Step {currentStepIndex + 1} of {totalSteps}
                </span>
                <span className="text-sm text-muted-foreground">
                  {applicationState}
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="container mx-auto flex flex-col items-start justify-center w-full max-w-4xl flex-1 pt-8">
        {applicationState === APPLICATION_STATES.INTRO &&
          <ApplicationIntro onNextClick={toNextState} />}
        {applicationState === APPLICATION_STATES.PROFILE &&
          <ApplicationProfile
            localApplicationState={localApplicationState}
            applicationState={applicationState}
            onNextClick={toNextState}
            onPrevClick={toPreviousState}
            onFormChange={updateFormData}
            isSubmitting={isSubmitting}
          />}
        {applicationState === APPLICATION_STATES.TEAM && <ApplicationTeam
          localApplicationState={localApplicationState}
          applicationState={applicationState}
          onNextClick={toNextState}
          onPrevClick={toPreviousState}
          onFormChange={updateFormData}
          isSubmitting={isSubmitting}
        />}
        {applicationState === APPLICATION_STATES.SPEED_DATING && <ApplicationSpeedDating
          localApplicationState={localApplicationState}
          applicationState={applicationState}
          onNextClick={toNextState}
          onPrevClick={toPreviousState}
          onFormChange={updateFormData}
          isSubmitting={isSubmitting}
        />}
        {applicationState === APPLICATION_STATES.APPLICATION && <ApplicationApplication
          localApplicationState={localApplicationState}
          applicationState={applicationState}
          onNextClick={toNextState}
          onPrevClick={toPreviousState}
          onFormChange={updateFormData}
          isSubmitting={isSubmitting}
        />}
        {applicationState === APPLICATION_STATES.LOGISTICAL_DETAIL && <ApplicationLogistic
          localApplicationState={localApplicationState}
          applicationState={applicationState}
          onNextClick={toNextState}
          onPrevClick={toPreviousState}
          onFormChange={updateFormData}
          isSubmitting={isSubmitting}
        />}
        {applicationState === APPLICATION_STATES.EMERGENCY_AND_CONSENT && <ApplicationEmergency
          localApplicationState={localApplicationState}
          applicationState={applicationState}
          onNextClick={toNextState}
          onPrevClick={toPreviousState}
          onFormChange={updateFormData}
          isSubmitting={isSubmitting}
        />}
        {applicationState === APPLICATION_STATES.ADDITIONAL_QUESTION &&
          <ApplicationAdditionalQuestion
            localApplicationState={localApplicationState}
            applicationState={applicationState}
            onPrevClick={toPreviousState}
            onFormChange={updateFormData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />}
        {applicationState === APPLICATION_STATES.SUBMITTED &&
          <ApplicationSubmittedForm />}
        {!(applicationState === APPLICATION_STATES.SUBMITTED) &&
          <ContactSupport />
        }
      </div>
    </div>
  );
}

export default Application;
