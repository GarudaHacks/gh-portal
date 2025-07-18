import { useEffect, useState } from "react";
import Page from "../components/Page";
import { FirestoreMentor, MentorshipAppointment, MentorshipConfig } from "@/types/mentorship";
import { fetchAllMentors, fetchMentorshipConfig, fetchMyMentorships } from "@/lib/http/mentorship";
import MentorshipAppointmentCardComponent from "@/components/MentorshipAppointmentCard";
import MentorCardComponent from "@/components/MentorCardComponent";

function Mentorship() {
  const [mentorshipConfig, setMentorshipConfig] = useState<MentorshipConfig>()
  const [myMentorships, setMyMentorships] = useState<MentorshipAppointment[]>()
  const [allMentors, setAllMentors] = useState<FirestoreMentor[]>()

  useEffect(() => {
    fetchMentorshipConfig().then((res) => {
      setMentorshipConfig(res)
    })
    fetchMyMentorships().then((res) => {
      setMyMentorships(res)
    })
    fetchAllMentors().then((res) => {
      setAllMentors(res)
    })
  }, [])

  return (
    <Page
      title="Mentorship"
      description="Submit a request or question to a mentor for help on your project."
    >
      <div className="flex flex-col gap-4">
        <div id="mentorship-period" className="bg-zinc-50/20 p-4 rounded-xl">
          {mentorshipConfig?.isMentorshipOpen ? (
            <h1 className="text-xl">✅ Mentorship is open</h1>
          ) : (
            <h1 className="text-xl">⚠️ Mentorship is currently not available</h1>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </Page>
  );
}

export default Mentorship;
