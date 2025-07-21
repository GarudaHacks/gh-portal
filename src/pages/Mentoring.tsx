import MentorshipSlotAsMentorComponent from "@/components/MentorshipSlotAsMentor";
import Page from "@/components/Page";
import { fetchMyMentorships } from "@/lib/http/mentorship";
import { MentorshipAppointmentResponseAsMentor } from "@/types/mentorship";
import { useEffect, useState } from "react";

export default function Mentoring() {

  const [upcomingMentorshipAppointments, setUpcomingMentorshipAppointments] = useState<MentorshipAppointmentResponseAsMentor[]>()
  const [recentMentorshipAppointments, setRecentMentorshipAppointments] = useState<MentorshipAppointmentResponseAsMentor[]>()

  useEffect(() => {
    fetchMyMentorships(true).then((res) => {
      setUpcomingMentorshipAppointments(res)
    })
    fetchMyMentorships(false, true).then((res) => {
      setRecentMentorshipAppointments(res)
    })
  }, [])

  return (
    <Page
      title="Mentoring"
      description="Your upcoming mentoring schedule"
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl">Upcoming Mentoring Schedule</h1>

        {upcomingMentorshipAppointments && upcomingMentorshipAppointments?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingMentorshipAppointments?.map((mentorshipAppointment) => (
              <MentorshipSlotAsMentorComponent key={mentorshipAppointment.id} mentorshipAppointment={mentorshipAppointment} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            <p className="text-muted text-sm">You have no upcoming mentorships.</p>
          </div>
        )}

        <h1 className="text-2xl">Past Mentorings</h1>
        {recentMentorshipAppointments && recentMentorshipAppointments?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentMentorshipAppointments?.map((mentorshipAppointment) => (
              <MentorshipSlotAsMentorComponent key={mentorshipAppointment.id} mentorshipAppointment={mentorshipAppointment} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            <p className="text-muted text-sm">You have no upcoming mentorships.</p>
          </div>
        )}
      </div>
    </Page>
  )
}