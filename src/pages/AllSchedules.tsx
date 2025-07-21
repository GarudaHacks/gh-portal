import MentorshipAppointmentCardAsMentorComponent from "@/components/MentorshipAppointmentCardAsMentor";
import Page from "@/components/Page";
import { mentorFetchMyMentorships } from "@/lib/http/mentorship";
import { MentorshipAppointmentResponseAsMentor } from "@/types/mentorship";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function AllSchedulePage() {
  const [loading, setLoading] = useState(false)
  const [mentoringSchedules, setMentoringSchedules] = useState<MentorshipAppointmentResponseAsMentor[]>([])

  useEffect(() => {
    setLoading(true)
    mentorFetchMyMentorships().then((mentorships) => {
      setMentoringSchedules(mentorships)
      setLoading(false)
    })
  }, [])

  return (
    <Page
      title="All Mentoring Schedules"
      description="See all of your mentoring schedules here"
    >
      <div>
        {loading ? (
          <div className="w-full min-h-screen flex flex-col items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {mentoringSchedules.map((slot) => (
              <MentorshipAppointmentCardAsMentorComponent mentorshipAppointment={slot} />
            ))}
          </div>
        )}
      </div>
    </Page>
  )
}