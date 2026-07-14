import MentorshipAppointmentCardAsMentorComponent from "@/components/MentorshipAppointmentCardAsMentor";
import Page from "@/components/Page";
import { mentorFetchMyMentorships } from "@/lib/http/mentorship";
import { MentorshipAppointmentResponseAsMentor } from "@/types/mentorship";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function MentorAllSchedulesPage() {
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
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-bold">All Schedules</h1>
          <p>All schedules based on your availability</p>
        </div>
        <div className="">
          {loading ? (
            <div className="w-full min-h-screen flex flex-col items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <>
              {mentoringSchedules.length > 0 ?
                <div className="flex flex-col gap-4">
                  {mentoringSchedules.map((slot) => (
                    <MentorshipAppointmentCardAsMentorComponent mentorshipAppointment={slot} showInstructions={false} />
                  ))}
                </div>
                :
                <div className="text-center text-sm text-muted-foreground">No mentoring schedules have been created</div>
              }
            </>
          )}
        </div>
      </div>
    </Page>
  )
}