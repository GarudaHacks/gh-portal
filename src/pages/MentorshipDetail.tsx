import { mentorFetchMyMentorship } from "@/lib/http/mentorship"
import { MentorshipAppointmentResponseAsMentor } from "@/types/mentorship"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export default function MentorshipDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [mentorshipAppointment, setMentorshipAppointment] = useState<MentorshipAppointmentResponseAsMentor>()
  useEffect(() => {

    if (!id) {
      // navigate("/mentoring")
      return;
    }
    mentorFetchMyMentorship(id).then((res) => {
      setMentorshipAppointment(res)
    })
  }, [])
  return (
    <div>
      {mentorshipAppointment?.id}
    </div>
  )
}