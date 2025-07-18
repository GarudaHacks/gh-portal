import { useEffect, useState } from "react";
import Page from "../components/Page";
import { MentorshipAppointment } from "@/types/mentorship";
import { fetchMyMentorships } from "@/lib/http/mentorship";
import MentorshipAppointmentCardComponent from "@/components/MentorshipAppointmentCard";

function Mentorship() {
  const [myMentorships, setMyMentorships] = useState<MentorshipAppointment[]>()

  useEffect(() => {
    fetchMyMentorships().then((res) => {
      console.log(res)
      setMyMentorships(res)
    })
  }, [])

  return (
    <Page
      title="Mentorship"
      description="Submit a request or question to a mentor for help on your project."
    >
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
      </div>
    </Page>
  );
}

export default Mentorship;
