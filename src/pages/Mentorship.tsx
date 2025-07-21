import { useEffect, useState } from "react";
import Page from "../components/Page";
import { FirestoreMentor, MentorshipAppointment, MentorshipConfig } from "@/types/mentorship";
import { fetchAllMentors, fetchMentorshipConfig, fetchMyMentorships } from "@/lib/http/mentorship";
import MentorshipAppointmentCardComponent from "@/components/MentorshipAppointmentCard";
import MentorCardComponent from "@/components/MentorCardComponent";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

function Mentorship() {
  const [loading, setLoading] = useState(false)
  const [mentorshipConfig, setMentorshipConfig] = useState<MentorshipConfig>()
  const [myMentorships, setMyMentorships] = useState<MentorshipAppointment[]>()
  const [allMentors, setAllMentors] = useState<FirestoreMentor[]>()

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      fetchMentorshipConfig(),
      fetchMyMentorships(),
      fetchAllMentors(),
    ])
      .then(([configRes, myMentorshipsRes, allMentorsRes]) => {
        if (isMounted) {
          setMentorshipConfig(configRes);
          setMyMentorships(myMentorshipsRes);
          setAllMentors(allMentorsRes);
          setLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.error('Error fetching data:', error);
          setLoading(false);
          toast.error("Failed to load data", error)
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Page
      title="Mentorship"
      description="Submit a request or question to a mentor for help on your project."
    >
      {loading ? (
        <div className="w-full min-h-screen flex flex-col items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (

        <div className="flex flex-col gap-4">
          <div id="mentorship-period" className="bg-zinc-50/20 p-4 rounded-xl">
            {mentorshipConfig?.isMentorshipOpen ? (
              <h1 className="text-xl">✅ Mentorship is currently open</h1>
            ) : (
              <h1 className="text-xl">⚠️ Mentorship is currently closed</h1>
            )}
          </div>

          <div className="flex flex-col gap-8">
            <div id="upcoming-mentorships" className="flex flex-col gap-4">
              <h2 className="font-semibold text-xl">Mentorship Requests</h2>
              {myMentorships && myMentorships.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {myMentorships.map((m) => (
                    <MentorshipAppointmentCardComponent key={m.id} mentorshipAppointment={m} />
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground">You are currently do not have any mentorships request.</p>
                </div>
              )}
            </div>

            <div id="mentors-list" className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="font-semibold text-xl">Garuda Hacks 6.0 Mentors</h2>
                <p className="text-sm text-zinc-300">Meet our mentors here!</p>
                {allMentors && allMentors.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                    {allMentors.map((m) => (
                      <MentorCardComponent key={m.id} mentor={m} />
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="text-muted-foreground">No mentors available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </Page>
  );
}

export default Mentorship;
