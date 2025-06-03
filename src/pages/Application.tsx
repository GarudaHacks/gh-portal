import { useEffect, useState } from "react";
import ApplicationIntro from "../components/ApplicationIntro";
import ApplicationNavbar from "../components/ApplicationNavbar";
import ApplicationProfile from "@/components/ApplicationProfile";
import ApplicationInquiry from "@/components/ApplicationInquiry";
import ApplicationAdditionalQuestion from "@/components/ApplicationAdditionalQuestion";
import ApplicationSubmitted from "@/components/ApplicationSubmitted";
import { APPLICATION_STATUS } from "@/types/application";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { getStateKey } from "@/utils/applicationUtils";
import { format, parse } from "date-fns";
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

function Application() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [times, setTimes] = useState(0);

  const [applicationState, setApplicationState] = useState(
    APPLICATION_STATES.INTRO
  );
  const [localApplicationState, setLocalApplicationState] =
    useState<LocalApplicationState>({
      latestState: APPLICATION_STATES.INTRO,
      data: {},
      lastUpdated: new Date(),
    });

  // save local application state to local storage
  const saveLocalApplicationState = () => {
    if (!localApplicationState) return;
    localStorage.setItem(
      "localApplicationState",
      JSON.stringify({
        latestState: localApplicationState.latestState,
        data: localApplicationState.data,
        lastUpdated: new Date().toISOString(),
      })
    );
  };

  // update form data
  const updateFormData = (questionId: string, type: string, response: any, error?: string) => {
    if (!localApplicationState) return;
    setLocalApplicationState({
      ...localApplicationState,
      data: {
        ...localApplicationState.data,
        [questionId]: {
          id: questionId,
          type,
          response,
          error: error || "",
        },
      },
    });
  };

  // handle submit
  const handleSubmit = async () => {
    // patch additional question data to DB
    let formResponse: { [key: string]: any } = {};

    for (const questionId in localApplicationState.data) {
      const question = localApplicationState.data[questionId];
      const response = question.response;

      formResponse[questionId] = response;
    }

    if (!user?.uid) {
      toast.error("You must be logged in to submit.");
      return;
    }

    const payload: {
      userId: string;
      state: string;
      [key: string]: any;
    } = {
      ...formResponse,
      userId: user.uid,
      state: "ADDITIONAL_QUESTION",
    };

    setIsSubmitting(true);
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
      const errorData = await response.json();

      if (errorData.details && Array.isArray(errorData.details)) {
        const updatedData = { ...localApplicationState.data };

        errorData.details.forEach(
          (error: { field_id: string; message: string }) => {
            const { field_id, message } = error;

            if (updatedData[field_id]) {
              updatedData[field_id] = {
                ...updatedData[field_id],
                error: message,
              };
            } else {
              updatedData[field_id] = {
                id: field_id,
                type: localApplicationState.data[field_id]?.type,
                response: localApplicationState.data[field_id]?.response,
                error: message,
              };
            }
          }
        );

        setLocalApplicationState({
          ...localApplicationState,
          data: updatedData,
        });

        toast.error("There are errors in your application.");
        setIsSubmitting(false);
        return;
      } else {
        setIsSubmitting(false);
        toast.error("Failed to save application.");
        return;
      }
    }

    // Only clear the local state after successful submission
    if (localApplicationState) {
      setLocalApplicationState({ ...localApplicationState, data: {} });
    }

    setApplicationState(APPLICATION_STATES.SUBMITTED);

    // temporarily update user state into "submitted" using firebase
    // assuming the user is saved to db already
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
        toast.error("Failed to save application. Please try again later.");
        console.error("Error saving application data:", data);
        return;
      }

      toast.success("Application submitted!");
    } catch (error) {
      console.error("Error saving application data:", error);
      toast.error("Failed to save application. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toNextState = async () => {
    try {
      if (
        applicationState !== APPLICATION_STATES.INTRO &&
        applicationState !== APPLICATION_STATES.SUBMITTED
      ) {
        setIsSubmitting(true);

        const state = getStateKey(applicationState);

        let formResponse: { [key: string]: any } = {};

        for (const questionId in localApplicationState.data) {
          const question = localApplicationState.data[questionId];
          const response = question.response;

          if (question.type === "file") {
            formResponse[questionId] = response.name;
            continue;
          } else if (question.type === "datetime") {
            try {
              // if response is a date, and is coming from betterdatepicker,
              const stringifyedResponse = response instanceof Date
                ? format(response, "MM/dd/yyyy")
                : response;
              const parsedDate = parse(stringifyedResponse, "MM/dd/yyyy", new Date());
              if (parsedDate.toString() !== "Invalid Date") {
                formResponse[questionId] = parsedDate.toISOString();
              }
            } catch (e) {
              console.error(
                `Error parsing date for question ${questionId}: ${response}`,
                e
              );
              // Decide how to handle: send original, null, or skip
            }
          } else {
            formResponse[questionId] = response;
          }
        }
        const payload: {
          userId: string | undefined;
          state: string;
          [key: string]: any;
        } = {
          ...formResponse,
          userId: user?.uid,
          state: state,
        };

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
          const errorData = await response.json();

          if (errorData.details && Array.isArray(errorData.details)) {
            const updatedData = { ...localApplicationState.data };

            errorData.details.forEach(
              (error: { field_id: string; message: string }) => {
                const { field_id, message } = error;

                if (updatedData[field_id]) {
                  updatedData[field_id] = {
                    ...updatedData[field_id],
                    error: message,
                  };
                } else {
                  updatedData[field_id] = {
                    id: field_id,
                    type: localApplicationState.data[field_id]?.type,
                    response: localApplicationState.data[field_id]?.response,
                    error: message,
                  };
                }
              }
            );

            setLocalApplicationState({
              ...localApplicationState,
              data: updatedData,
            });

            toast.error("There are errors in your application");
            setIsSubmitting(false);
            return;
          } else {
            setIsSubmitting(false);
            toast.error("Failed to save application");
          }
        }
      }

      const currentIndex = APPLICATION_STATES_ARRAY.indexOf(applicationState);
      if (currentIndex < APPLICATION_STATES_ARRAY.length - 1) {
        const nextState = APPLICATION_STATES_ARRAY[currentIndex + 1];
        setApplicationState(APPLICATION_STATES_ARRAY[currentIndex + 1]);

        // Update localApplicationState.latestState to match
        setLocalApplicationState((prev) => ({
          ...prev,
          latestState: nextState,
        }));
      }
    } catch (error) {
      console.error("Error saving application data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toPreviousState = () => {
    const currentIndex = APPLICATION_STATES_ARRAY.indexOf(applicationState);
    if (currentIndex > 0) {
      const prevState = APPLICATION_STATES_ARRAY[currentIndex - 1];
      setApplicationState(APPLICATION_STATES_ARRAY[currentIndex - 1]);

      setLocalApplicationState((prev) => ({
        ...prev,
        latestState: prevState,
      }));
    }
  };

  useEffect(() => {
    // check from db whether user.status is "submitted"
    // if yes, redirect to home page
    const fetchApplicationStatus = async () => {
      const response = await fetch("/api/application/status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      if (data.data === APPLICATION_STATUS.SUBMITTED) {
        navigate("/home");
        return;
      }
    };

    fetchApplicationStatus();

    const localApplicationStateJson = localStorage.getItem(
      "localApplicationState"
    );
    if (localApplicationStateJson) {
      try {
        const json = JSON.parse(localApplicationStateJson);

        // Convert the lastUpdated string back to a Date object
        if (json.lastUpdated) {
          json.lastUpdated = new Date(json.lastUpdated);
        }

        if (
          json.latestState &&
          APPLICATION_STATES_ARRAY.includes(json.latestState)
        ) {
          setApplicationState(json.latestState);
        }

        setLocalApplicationState(json);
      } catch (error) {
        console.error("Error parsing localApplicationState:", error);
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
    if (times > 0) {
      saveLocalApplicationState();
    }
    setTimes((times) => times + 1);
  }, [localApplicationState, applicationState]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="">
      <div>
        <ApplicationNavbar
          applicationState={applicationState}
          onPrevClick={toPreviousState}
        />
      </div>

      <div className=" container mx-auto flex items-center justify-center w-full max-w-4xl">
        {applicationState === APPLICATION_STATES.INTRO ? (
          <ApplicationIntro onNextClick={toNextState} />
        ) : null}
        {applicationState === APPLICATION_STATES.PROFILE ? (
          <ApplicationProfile
            localApplicationState={localApplicationState!}
            applicationState={applicationState}
            onNextClick={toNextState}
            onPrevClick={toPreviousState}
            onFormChange={updateFormData}
            isSubmitting={isSubmitting}
          />
        ) : null}
        {applicationState === APPLICATION_STATES.INQUIRY ? (
          <ApplicationInquiry
            localApplicationState={localApplicationState!}
            applicationState={applicationState}
            onPrevClick={toPreviousState}
            onNextClick={toNextState}
            onFormChange={updateFormData}
            isSubmitting={isSubmitting}
          />
        ) : null}
        {applicationState === APPLICATION_STATES.ADDITIONAL_QUESTION ? (
          <ApplicationAdditionalQuestion
            localApplicationState={localApplicationState!}
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
