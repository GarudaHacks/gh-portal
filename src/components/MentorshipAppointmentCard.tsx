import { MentorshipAppointmentResponseAsHacker } from "@/types/mentorship"
import { epochToStringDate } from "@/utils/dateUtils"
import { Badge } from "./ui/badge"
import { ChevronDown, Lightbulb, MapPinCheck, MonitorSmartphone, MoreHorizontalIcon, Video } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface MentorshipAppointmentCardComponentProps {
  mentorshipAppointment: MentorshipAppointmentResponseAsHacker
}

export default function MentorshipAppointmentCardComponent(
  { mentorshipAppointment }: MentorshipAppointmentCardComponentProps
) {
  return (
    <div className="border bg-blue-950/50 hover:bg-zinc-200/10 rounded-xl p-4 flex flex-col gap-4 h-fit">
      <div className="flex flex-row gap-4 items-center justify-between ">
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
          <p className="line-clamp-3 text-xs">{mentorshipAppointment.hackerDescription}</p>
        </div>

        <div className="flex flex-col gap-2 items-center text-sm">
          <Button variant={"outline"} className="w-full"><img src="/images/icons/zoom-icon.svg" width={32} height={32} className="h-6" /></Button>
          <Button variant={"outline"} className="w-full"><img src="/images/icons/discord-icon.svg" width={32} height={32} className="h-6" /></Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"outline"} className="w-full"><MoreHorizontalIcon /></Button>
            </DialogTrigger>
            <DialogContent className="text-white">
              <DialogHeader>
                <DialogTitle>Mentorship Detail</DialogTitle>
                <DialogDescription className="text-white">
              You can cancel your mentorship session up to 30 minutes before the appointment.
                </DialogDescription>
              </DialogHeader>
              <Button variant={"destructive"} className="">Cancel Mentorship</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Collapsible>
        <CollapsibleTrigger className="flex flex-row gap-1 text-md justify-end w-full">
          <Badge variant={"outline"} className="text-white border-0">
            <Lightbulb /> Instruction
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