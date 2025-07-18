import { MentorshipAppointment } from "@/types/mentorship"
import { Button } from "./ui/button"
import { epochToStringDate, isTimeElapsed } from "@/utils/dateUtils"
import { Badge } from "./ui/badge"

interface MentorshipSlotAsHackerComponentProps {
  mentorshipAppointment: MentorshipAppointment
  isMentorshipOpen: boolean
}

export default function MentorshipSlotAsHackerComponent(
  { mentorshipAppointment, isMentorshipOpen }: MentorshipSlotAsHackerComponentProps
) {
  return (
    <div className="border p-4 rounded-xl flex flex-col gap-2 justify-between">
      <p className="text-xs text-muted-foreground">Mentorship ID: {mentorshipAppointment.id}</p>

      {mentorshipAppointment.hackerId ? (
        <Badge variant={"destructive"}>Booked</Badge>
      ) : (
        <Badge variant={"default"} className="bg-green-500">Available</Badge>
      )
      }
      <div>

        <p>{epochToStringDate(mentorshipAppointment.startTime)} - {epochToStringDate(mentorshipAppointment.endTime)} <span className="font-semibold">({(mentorshipAppointment.endTime - mentorshipAppointment.startTime) / 60}) minutes</span></p>
      </div>

      <div className="flex justify-end">
        <Button disabled={!isMentorshipOpen || !!mentorshipAppointment.hackerId || isTimeElapsed(mentorshipAppointment.startTime)}>Request</Button>
      </div>

    </div>
  )
}