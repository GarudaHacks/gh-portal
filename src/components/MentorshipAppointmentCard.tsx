import { MentorshipAppointment } from "@/types/mentorship"
import { epochToStringDate } from "@/utils/dateUtils"

interface MentorshipAppointmentCardComponentProps {
  mentorshipAppointment: MentorshipAppointment
}

export default function MentorshipAppointmentCardComponent(
  { mentorshipAppointment }: MentorshipAppointmentCardComponentProps
) {
  return (
    <div className="border rounded-xl p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className='flex flex-row items-center gap-1'>
          {mentorshipAppointment.hackerId ? (
            <span className="border rounded-full py-1 px-2 text-xs bg-green-500">Booked</span>
          ) : (
            <span className="border rounded-full py-1 px-2 text-xs">Available</span>
          )}
          {mentorshipAppointment.location === 'online' ? (
            <span className="border rounded-full py-1 px-2 text-xs bg-yellow-700">Online</span>
          ) : (
            <span className="border rounded-full py-1 px-2 text-xs bg-blue-700">Offline</span>
          )}
        </div>
        <p className="text-end text-xs text-muted-foreground">
          Mentoring ID: {mentorshipAppointment.id}
        </p>
      </div>
      <div>
        {epochToStringDate(mentorshipAppointment.startTime)} -{' '}
        {epochToStringDate(mentorshipAppointment.endTime)}{' '}
        <span className="font-bold">
          ({(mentorshipAppointment.endTime - mentorshipAppointment.startTime) / 60}{' '}
          minutes)
        </span>
      </div>

      {mentorshipAppointment.hackerDescription && (
        <div className="text-sm flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">Hacker's Inquiry:</p>
          <p>{mentorshipAppointment.hackerDescription}</p>
        </div>
      )}
    </div>
  )
}