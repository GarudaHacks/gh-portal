import { MentorshipAppointmentResponseAsHacker } from "@/types/mentorship"
import { epochToStringDate } from "@/utils/dateUtils"
import { Badge } from "./ui/badge"
import { ChevronDown, Lightbulb, MapPinCheck, MonitorSmartphone, Video } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
    <div className="border rounded-xl p-4 flex flex-col gap-4 h-fit">
      <div className="flex flex-row gap-4 items-baseline justify-between ">
        <div className="flex flex-col gap-4">
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
          </div>

          <p>{(mentorshipAppointment.endTime - mentorshipAppointment.startTime) / 60}{' '}minutes</p>

        </div>

        <div className="flex flex-row gap-2 items-center text-sm">
          <Button variant={"outline"} className="p-0"><Video /></Button>
        </div>
      </div>

      <Collapsible>
        <CollapsibleTrigger className="flex flex-row gap-1 text-md">
          <Badge variant={"outline"} className="text-white border-0">
            <Lightbulb /> Instruction <ChevronDown />
          </Badge>
        </CollapsibleTrigger>
        <CollapsibleContent className="py-4">
          <Alert variant={"default"}>
            <AlertDescription className="text-white">
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