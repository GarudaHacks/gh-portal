import { MentorshipAppointmentResponseAsHacker } from "@/types/mentorship"
import { epochToStringDate } from "@/utils/dateUtils"
import { Badge } from "./ui/badge"
import { ChevronDown, Lightbulb, MapPinCheck, MonitorSmartphone, MoreHorizontalIcon, Video } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { titleCase } from "title-case";
import Countdown, { zeroPad } from 'react-countdown';
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
import { cancelMentorshipAppointment } from "@/lib/http/mentorship"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

interface MentorshipAppointmentCardComponentProps {
  mentorshipAppointment: MentorshipAppointmentResponseAsHacker
}

const Completionist = () => <span>Mentoring started</span>;

const renderer = ({ hours, minutes, seconds, completed }: { hours: number, minutes: number, seconds: number, completed: boolean }) => {
  if (completed) {
    return <Completionist />;
  } else {
    return <span>{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>;
  }
};

export default function MentorshipAppointmentCardComponent(
  { mentorshipAppointment }: MentorshipAppointmentCardComponentProps
) {
  const navigate = useNavigate()

  const handleCancelAppointment = async () => {
    try {
      const payload = {
        id: mentorshipAppointment.id
      };
      const res = await cancelMentorshipAppointment(payload);
      toast.success(res.message || "Mentorship slots booked successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000)
    } catch (error: any) {
      console.error("Error booking mentorship:", error);
      if (error.message.includes("limit reached")) {
        toast.error("Booking limit reached. Please select fewer slots or try different slots.");
      } else {
        toast.error(error.message || "Failed to book mentorship slots");
      }
    }
  }

  return (
    <div className="border bg-blue-950/50 hover:bg-zinc-200/10 rounded-xl p-4 flex flex-col gap-4 h-fit">
      <div className="grid grid-cols-6 gap-4 items-center justify-between">
        <div className="col-span-5 flex flex-col gap-4">
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

          <div>In <Countdown date={mentorshipAppointment.startTime * 1000} renderer={renderer} /></div>
          <p className="line-clamp-3 text-xs">{mentorshipAppointment.hackerDescription}</p>
        </div>

        <div className="col-span-1 flex flex-col gap-2 items-center text-sm">
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
                  You can cancel your mentorship session up to 45 minutes before the appointment.
                </DialogDescription>
              </DialogHeader>
              <Button variant={"destructive"} className="" onClick={handleCancelAppointment}>Cancel Mentorship</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Collapsible>
        <CollapsibleTrigger className="flex flex-row gap-1 text-md justify-end w-full">
          <Badge variant={"outline"} className="text-white border-0">
            <Lightbulb /> {titleCase(mentorshipAppointment.location)} Instruction
          </Badge>
        </CollapsibleTrigger>
        <CollapsibleContent className="py-4">
          <Alert variant={"default"}>
            <AlertDescription className="text-white text-sm">
              {mentorshipAppointment.location === 'online' ? (
                <ol className="list-decimal p-4">
                  <li>Reach out to the mentor to confirm whether the mentorship will be conducted via Zoom or another communication platform, such as Discord.</li>
                  <li>You can always use the Zoom link by joining the Breakout Room designated for your mentor.</li>
                </ol>
              ) : (
                <ol className="list-decimal p-4">
                  <li>Reach out to the mentor to confirm the location of your meeting.</li>
                  <li>You may use the Zoom link instead and join the Breakout Room designated for your mentor. The decision is up to you and the mentor.</li>
                </ol>
              )}
            </AlertDescription>
          </Alert>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}