import { useEffect, useRef, useState } from "react";
import ApplicationIntro from "./application/ApplicationIntro";
import ApplicationNavbar from "./application/ApplicationNavbar";
import ApplicationProfile from "@/pages/application/ApplicationProfile";
import ApplicationInquiry from "@/pages/application/ApplicationInquiry";
import ApplicationAdditionalQuestion from "@/pages/application/ApplicationAdditionalQuestion";
import ApplicationSubmitted from "@/pages/application/ApplicationSubmitted";
import { APPLICATION_STATUS } from "@/types/application";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { getStateKey } from "@/utils/applicationUtils";
import { parse } from "date-fns";
import { useAuth } from "@/context/AuthContext";

export enum APPLICATION_STATES {
  INTRO = "Intro",
  PROFILE = "Your Profile",
  INQUIRY = "Application Questions",
  ADDITIONAL_QUESTION = "Additional Questions",
  SUBMITTED = "Submitted",
}

const APPLICATION_STATES_ARRAY = Object.values(APPLICATION_STATES);

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
      formResponse[questionId] = response.name;
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
    const payload = {
      ...buildFormResponse(data),
      userId: user?.uid,
      state,
    };
    try {
      const response = await fetch("/api/application", {
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

    try {
      const response = await fetch("/api/application/status", {
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

    const nextState = APPLICATION_STATES_ARRAY[currentIndex + 1];
    setApplicationState(nextState);
    setLocalApplicationState((prev) => ({ ...prev, latestState: nextState }));
  };

  const toPreviousState = () => {
    const currentIndex = APPLICATION_STATES_ARRAY.indexOf(applicationState);
    if (currentIndex <= 0) return;
    const prevState = APPLICATION_STATES_ARRAY[currentIndex - 1];
    setApplicationState(prevState);
    setLocalApplicationState((prev) => ({ ...prev, latestState: prevState }));
  };

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      const response = await fetch("/api/application/status", {
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

    const saved = localStorage.getItem("localApplicationState");
    if (saved) {
      try {
        const json = JSON.parse(saved);
        if (json.lastUpdated) json.lastUpdated = new Date(json.lastUpdated);
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

  return (
    <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
      <div>
        <ApplicationNavbar
          applicationState={applicationState}
          onPrevClick={toPreviousState}
        />
      </div>

      <div className="container mx-auto flex items-center justify-center w-full max-w-4xl flex-1">
        {applicationState === APPLICATION_STATES.INTRO ? (
          <ApplicationIntro onNextClick={toNextState} />
        ) : null}
        {applicationState === APPLICATION_STATES.PROFILE ? (
          <ApplicationProfile
            localApplicationState={localApplicationState}
            applicationState={applicationState}
            onNextClick={toNextState}
            onPrevClick={toPreviousState}
            onFormChange={updateFormData}
            isSubmitting={isSubmitting}
          />
        ) : null}
        {applicationState === APPLICATION_STATES.INQUIRY ? (
          <ApplicationInquiry
            localApplicationState={localApplicationState}
            applicationState={applicationState}
            onPrevClick={toPreviousState}
            onNextClick={toNextState}
            onFormChange={updateFormData}
            isSubmitting={isSubmitting}
          />
        ) : null}
        {applicationState === APPLICATION_STATES.ADDITIONAL_QUESTION ? (
          <ApplicationAdditionalQuestion
            localApplicationState={localApplicationState}
            applicationState={applicationState}
            onPrevClick={toPreviousState}
            onFormChange={updateFormData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        ) : null}
        {applicationState === APPLICATION_STATES.SUBMITTED ? (
          <ApplicationSubmitted />
        ) : null}
      </div>
    </div>
  );
}

export default Application;
