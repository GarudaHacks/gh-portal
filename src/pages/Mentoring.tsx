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
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold">Upcoming Mentoring Schedules</h1>
              <p>All of your upcoming booked schedules will be shown here.</p>
            </div>

            <p className="text-sm text-muted">Showing {upcomingMentorshipAppointments?.length} results</p>

            {upcomingMentorshipAppointments && upcomingMentorshipAppointments?.length > 0 ? (
              <div className="flex flex-col lg:flex-row gap-4">
                {upcomingMentorshipAppointments?.map((mentorshipAppointment) => (
                  <MentorshipAppointmentCardAsMentorComponent key={mentorshipAppointment.id} mentorshipAppointment={mentorshipAppointment} showInstructions />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                <p className="text-muted text-sm">You have no upcoming booked mentorships.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Page>
  )
}