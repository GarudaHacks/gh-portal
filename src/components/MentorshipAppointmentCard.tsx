import { MentorshipAppointmentResponseAsHacker } from "@/types/mentorship"
import { epochToStringDate } from "@/utils/dateUtils"
import { Badge } from "./ui/badge"
import { ChevronDown, MapPinCheck, MonitorSmartphone, Video } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "./ui/button"

interface MentorshipAppointmentCardComponentProps {
  mentorshipAppointment: MentorshipAppointmentResponseAsHacker
}

export default function MentorshipAppointmentCardComponent(
  { mentorshipAppointment }: MentorshipAppointmentCardComponentProps
) {
  return (
    <div className="border rounded-xl p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className='flex flex-row items-center gap-2'>
          <Badge variant={"default"} className="bg-green-500">Booked</Badge>
          <Badge variant={"outline"} className="text-white flex flex-row items-center gap-1">{mentorshipAppointment.location.toUpperCase()}
            {mentorshipAppointment.location === 'online' ? (
              <MonitorSmartphone size={16} />
            ) : (
              <MapPinCheck size={16} />
            )}
          </Badge>
        </div>
      </div>

      <div>
        {epochToStringDate(mentorshipAppointment.startTime)} -{' '}
        {epochToStringDate(mentorshipAppointment.endTime)}{' '}
        <span className="font-bold">
          ({(mentorshipAppointment.endTime - mentorshipAppointment.startTime) / 60}{' '}
          minutes)
        </span>
      </div>

      <div className="flex flex-row gap-2 items-center text-sm">
        <Video /><Button variant={"link"} className="p-0">https://zoom.us</Button>
      </div>

      {mentorshipAppointment.hackerDescription && (
        <div className="text-sm flex flex-col gap-2">
           <p className="text-slate-300">{mentorshipAppointment.hackerDescription}</p>
        </div>
      )}

      <Collapsible>
        <CollapsibleTrigger className="flex flex-row gap-1 text-md">
          <Badge variant={"outline"} className="text-white border-0">
            Instruction <ChevronDown />
          </Badge>
        </CollapsibleTrigger>
        <CollapsibleContent className="py-4">
          <Alert variant={"default"}>
            <AlertDescription>
              <ol>
                <li>1. Private message your mentor through Discord for preparation in-advance</li>
                <li>2. You can always join the zoom link</li>
              </ol>
            </AlertDescription>
          </Alert>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}