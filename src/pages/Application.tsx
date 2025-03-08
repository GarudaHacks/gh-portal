import { useEffect, useState } from "react";
import ApplicationIntro from "../components/ApplicationIntro";
import ApplicationNavbar from "../components/ApplicationNavbar";
import ApplicationProfile from "@/components/ApplicationProfile";
import ApplicationInquiry from "@/components/ApplicationInquiry";
import ApplicationAdditionalQuestion from "@/components/ApplicationAdditionalQuestion";
import ApplicationSubmitted from "@/components/ApplicationSubmitted";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { APPLICATION_STATUS } from "@/types/application";
import { useNavigate } from "react-router-dom";
import { Loader, Loader2 } from "lucide-react";

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
    };
  };
  lastUpdated: Date;
}

function Application() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [applicationState, setApplicationState] = useState(
    APPLICATION_STATES.INTRO
  );
  const [localApplicationState, setLocalApplicationState] = useState<LocalApplicationState>({
    latestState: APPLICATION_STATES.INTRO,
    data: {},
    lastUpdated: new Date()
  });

  // save local application state to local storage
  const saveLocalApplicationState = () => {
    if (!localApplicationState) return;
    localStorage.setItem(
      "localApplicationState",
      JSON.stringify({
        latestState: applicationState,
        data: localApplicationState.data,
        lastUpdated: new Date().toISOString(),
      })
    );
  };

  // update form data
  const updateFormData = (questionId: string, type: string, response: any) => {
    if (!localApplicationState) return;
    setLocalApplicationState({
      ...localApplicationState,
      data: {
        ...localApplicationState.data,
        [questionId]: {
          id: questionId,
          type,
          response,
        },
      },
    });
  };

  // handle submit
  const handleSubmit = async () => {
    // remove data for security
    if (localApplicationState)
      setLocalApplicationState({ ...localApplicationState, data: {} });

    // TODO: submit form data to backend
    setApplicationState(APPLICATION_STATES.SUBMITTED);
    console.log(localApplicationState);

    // temporarily update user state into "submitted" using firebase
    // assuming the user is saved to db already
    if (user) {
      const ref = doc(db, "users", user.uid);
      const userSnap = await getDoc(ref);

      await setDoc(ref, {
        ...userSnap.data(),
        status: APPLICATION_STATUS.SUBMITTED,
      });
    }
  };

  const toNextState = () => {
    const currentIndex = APPLICATION_STATES_ARRAY.indexOf(applicationState);
    if (currentIndex < APPLICATION_STATES_ARRAY.length - 1) {
      setApplicationState(APPLICATION_STATES_ARRAY[currentIndex + 1]);
    }
  };

  const toPreviousState = () => {
    const currentIndex = APPLICATION_STATES_ARRAY.indexOf(applicationState);
    if (currentIndex > 0) {
      setApplicationState(APPLICATION_STATES_ARRAY[currentIndex - 1]);
    }
  };

  useEffect(() => {
    // check from db whether user.status is "submitted"
    // if yes, redirect to home page
    const checkUserSubmitted = async () => {
      if (user) {
        const ref = doc(db, "users", user.uid);
        const userSnap = await getDoc(ref);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.status === APPLICATION_STATUS.SUBMITTED) {
            navigate("/")
          }
        }
      }
    };
    checkUserSubmitted();

    const localApplicationStateJson = localStorage.getItem(
      "localApplicationState"
    );
    if (localApplicationStateJson) {
      const json = JSON.parse(localApplicationStateJson);
      setLocalApplicationState(json);
      if (
        json.latestState &&
        APPLICATION_STATES_ARRAY.includes(json.latestState)
      ) {
        setApplicationState(json.latestState);
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
    saveLocalApplicationState();
  }, [localApplicationState, applicationState]);

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center">
      <Loader2 className="animate-spin"/>
    </div>;
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
            onFormChange={updateFormData}
          />
        ) : null}
        {applicationState === APPLICATION_STATES.INQUIRY ? (
          <ApplicationInquiry
            localApplicationState={localApplicationState!}
            applicationState={applicationState}
            onPrevClick={toPreviousState}
            onNextClick={toNextState}
            onFormChange={updateFormData}
          />
        ) : null}
        {applicationState === APPLICATION_STATES.ADDITIONAL_QUESTION ? (
          <ApplicationAdditionalQuestion
            localApplicationState={localApplicationState!}
            applicationState={applicationState}
            onPrevClick={toPreviousState}
            onFormChange={updateFormData}
            onSubmit={handleSubmit}
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
