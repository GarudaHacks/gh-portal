import MentorshipAppointmentCardAsMentorComponent from "@/components/MentorshipAppointmentCardAsMentor";
import Page from "@/components/Page";
import { mentorFetchMyMentorships } from "@/lib/http/mentorship";
import { MentorshipAppointmentResponseAsMentor } from "@/types/mentorship";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function MentoringPage() {

  const [upcomingMentorshipAppointments, setUpcomingMentorshipAppointments] = useState<MentorshipAppointmentResponseAsMentor[]>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    mentorFetchMyMentorships(undefined, true, false, true, false).then((res) => {
      setUpcomingMentorshipAppointments(res)
      setLoading(false)
    }).catch((err) => {
      toast.error(err)
      setLoading(false)
    })
  }, [])

  return (
    <Page
      title="Mentoring"
      description="Your upcoming mentoring schedule"
    >
      <div className="flex flex-col gap-4">

        {loading ? (
          <div className="flex flex-col w-full min-h-screen justify-center items-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">

            <h1 className="text-2xl">Upcoming Mentoring Schedule ({upcomingMentorshipAppointments?.length ? upcomingMentorshipAppointments.length : '0'})</h1>

            {upcomingMentorshipAppointments && upcomingMentorshipAppointments?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingMentorshipAppointments?.map((mentorshipAppointment) => (
                  <MentorshipAppointmentCardAsMentorComponent key={mentorshipAppointment.id} mentorshipAppointment={mentorshipAppointment} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                <p className="text-muted text-sm">You have no upcoming mentorships.</p>
              </div>
            )}
          </div>

        )}

      </div>
    </Page>
  )
}