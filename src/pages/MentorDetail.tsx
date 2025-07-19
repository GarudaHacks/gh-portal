import MentorshipSlotAsHackerComponent from "@/components/MentorshipSlotAsHacker";
import Page from "@/components/Page";
import { fetchMentorById, fetchMentorshipAppointmentsByMentorId, fetchMentorshipConfig } from "@/lib/http/mentorship";
import { FirestoreMentor, MentorshipAppointment, MentorshipConfig } from "@/types/mentorship";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function MentorDetailPage() {
  const navigate = useNavigate();

  const [mentorshipConfig, setMentorshipConfig] = useState<MentorshipConfig>()
  const { mentorId } = useParams<{ mentorId: string }>()
  const [mentor, setMentor] = useState<FirestoreMentor>()
  const [mentorshipAppointments, setMentorshipAppointments] = useState<MentorshipAppointment[]>()

  useEffect(() => {
    fetchMentorshipConfig().then((res) => {
      setMentorshipConfig(res)
    })

    if (!mentorId) {
      navigate(`/mentorship`)
      return;
    };

    fetchMentorById(mentorId).then((res) => {
      setMentor(res)
    })

    fetchMentorshipAppointmentsByMentorId(mentorId).then((res) => {
      setMentorshipAppointments(res)
    })
  }, [mentorId])

  return (
    <Page
      title="Mentor"
      description="Book a mentor and discuss your idea!"
    >
      <div className="flex flex-col gap-4">
        <div className="p-4 rounded-xl flex flex-row gap-8 items-center">
          <div>
            <img
              src={"https://garudahacks.com/images/logo/ghq.png"}
              alt={`Profile picture of ${mentor?.name || 'mentor'}`}
              width={200}
              height={200}
              className="rounded-full w-56 aspect-square border"
            />
          </div>

          <div className="flex flex-col gap-2 ">
            {mentor?.name && <h2 className="text-2xl font-bold">{mentor?.name}</h2>}
            {mentor?.email && <h3 className="text-muted-foreground">{mentor?.email}</h3>}
            {mentor?.discordUsername && <p className="">Discord: <span className="text-muted-foreground font-mono w-fit p-1 rounded-full text-sm">{mentor?.discordUsername}</span></p>}
            {mentor?.specialization && <p className="">Specialization: {mentor?.specialization.toUpperCase()}</p>}
            <div>
              <p className="text-sm">{mentor?.intro}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="font-bold">Mentorship Slots {mentorshipAppointments && <>({mentorshipAppointments?.length})</>}</h1>

          {mentorshipAppointments ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {mentorshipAppointments?.map((mentorshipAppointment) => (
                <MentorshipSlotAsHackerComponent key={mentorshipAppointment.id} mentorshipAppointment={mentorshipAppointment} isMentorshipOpen={mentorshipConfig?.isMentorshipOpen || false} />
              ))}
            </div>
          ) : (
            <div>
              <p>No mentorship available for this mentor</p>
            </div>
          )}
        </div>
      </div>
    </Page>
  )
}