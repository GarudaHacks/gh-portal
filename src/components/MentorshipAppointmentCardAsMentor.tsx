import { MentorshipAppointmentResponseAsMentor } from "@/types/mentorship"
import { epochToStringDate } from "@/utils/dateUtils"
import { Badge } from "./ui/badge"
import { Lightbulb, MapPinCheck, MonitorSmartphone, MoreHorizontalIcon, Video, Clock, CheckCircle, CheckCheck, Flag } from "lucide-react"
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
import { useMemo } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useNavigate } from "react-router-dom"
import MentorEditAppointmentComponent from "./MentorEditAppointmentComponent"
import { MENTORSHIP_ZOOM_LINK } from "@/utils/portalConfig"

interface MentorshipAppointmentCardComponentProps {
  mentorshipAppointment: MentorshipAppointmentResponseAsMentor
}

type AppointmentState = 'upcoming' | 'ongoing' | 'completed';

const getAppointmentState = (startTime: number, endTime: number): AppointmentState => {
  const now = Date.now() / 1000; // Convert to seconds

  if (now < startTime) {
    return 'upcoming';
  } else if (now >= startTime && now <= endTime) {
    return 'ongoing';
  } else {
    return 'completed';
  }
};

const UpcomingRenderer = ({ hours, minutes, seconds, completed }: { hours: number, minutes: number, seconds: number, completed: boolean }) => {
  if (completed) {
    return <span className="font-semibold text-sm text-yellow-400">Starting now...</span>;
  } else {
    return <span className="font-semibold text-sm text-blue-400">Starts in {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>;
  }
};

const OngoingRenderer = ({ hours, minutes, seconds, completed }: { hours: number, minutes: number, seconds: number, completed: boolean }) => {
  if (completed) {
    return <span className="font-semibold text-sm text-gray-400">Session ended</span>;
  } else {
    return <span className="font-semibold text-sm text-green-400">Ends in {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>;
  }
};

export default function MentorshipAppointmentCardAsMentorComponent(
  { mentorshipAppointment }: MentorshipAppointmentCardComponentProps
) {
  const navigate = useNavigate()
  const appointmentState = useMemo(() =>
    getAppointmentState(mentorshipAppointment.startTime, mentorshipAppointment.endTime),
    [mentorshipAppointment.startTime, mentorshipAppointment.endTime]
  );

  const getStateConfig = () => {
    switch (appointmentState) {
      case 'upcoming':
        return {
          bgColor: 'bg-blue-950/50 hover:bg-blue-900/20',
          statusBadge: <Badge variant="outline" className="text-blue-400 border-blue-400"><Clock size={14} className="mr-1" />Upcoming</Badge>,
          countdown: <Countdown date={mentorshipAppointment.startTime * 1000} renderer={UpcomingRenderer} />,
          buttonText: 'Prepare',
          buttonVariant: 'outline' as const,
          buttonDisabled: false
        };
      case 'ongoing':
        return {
          bgColor: 'bg-green-950/50 hover:bg-green-900/20 border-green-500',
          statusBadge: <Badge variant="outline" className="text-green-400 border-green-400 animate-pulse"><Video size={14} className="mr-1" />Live</Badge>,
          countdown: <Countdown date={mentorshipAppointment.endTime * 1000} renderer={OngoingRenderer} />,
          buttonText: 'Join Now',
          buttonVariant: 'default' as const,
          buttonDisabled: false
        };
      case 'completed':
        return {
          bgColor: 'bg-gray-950/50 hover:bg-gray-900/20',
          statusBadge: <Badge variant="outline" className="text-gray-400 border-gray-400"><CheckCircle size={14} className="mr-1" />Completed</Badge>,
          countdown: <span className="font-semibold text-sm text-gray-400">Session completed</span>,
          buttonText: 'Completed',
          buttonVariant: 'outline' as const,
          buttonDisabled: true
        };
    }
  };

  const config = getStateConfig();

  return (
    <div className={`border rounded-xl p-4 flex flex-col gap-4 h-fit ${config.bgColor}`}>
      <div className="flex gap-4 items-center justify-between">
        <div className="lex flex-col gap-4 w-full">
          <div className="flex justify-between items-start w-full gap-4">
            <div className="flex flex-col gap-4">
              <div className='flex flex-row items-center gap-2 flex-wrap'>
                {mentorshipAppointment.hackerId && (<Badge variant={"default"} className="bg-green-500">Booked</Badge>)}
                {config.statusBadge}
                <Badge variant={"outline"} className="text-white flex flex-row items-center gap-1">{mentorshipAppointment.location.toUpperCase()}
                  {mentorshipAppointment.location === 'online' ? (
                    <MonitorSmartphone size={16} />
                  ) : (
                    <MapPinCheck size={16} />
                  )}
                </Badge>
                {mentorshipAppointment.mentorMarkAsDone && (<Badge variant={"outline"} className="text-green-500 border-green-500"><CheckCheck /> Marked as Done</Badge>)}
                {mentorshipAppointment.mentorMarkAsAfk && (<Badge variant={"outline"} className="text-yellow-500 border-yellow-500"><Flag /> Marked as AFK</Badge>)}
              </div>
              <div>
                {mentorshipAppointment.teamName && <span className="font-bold text-sm">Team Name: {mentorshipAppointment.teamName}</span>}
              </div>
              <div>
                {epochToStringDate(mentorshipAppointment.startTime)} - {' '}
                {epochToStringDate(mentorshipAppointment.endTime)}{' '}
              </div>

              <div>
                {config.countdown}
              </div>

            </div>
            <div className=" flex flex-col items-end gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={"ghost"} size={"icon"}>
                    <MoreHorizontalIcon />
                  </Button>
                </DialogTrigger>
                <DialogContent className="text-white max-h-[80vh] overflow-y-scroll">
                  <DialogHeader className="text-white">
                    <DialogTitle>Mentorship Detail</DialogTitle>
                    <h2 className="text-xs text-muted-foreground">Ref ID: {mentorshipAppointment.id}</h2>
                    <DialogDescription className="text-white">
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex flex-col gap-4">
                    <div className="border p-4 rounded-lg">
                      <h3 className="font-semibold">Hacker and Team Detail</h3>
                      {mentorshipAppointment.hackerId ? (
                        <div className="mt-2 text-sm">
                          <p>Hacker Name: {mentorshipAppointment.hackerName}</p>
                          <p>Team Name: {mentorshipAppointment.teamName}</p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">This slot has not been booked by any hacker.</p>
                      )}
                    </div>

                    <div className="border p-4 rounded-lg">
                      <h3 className="font-semibold">Hacker Inquiry</h3>

                      {mentorshipAppointment.hackerDescription ? (
                        <div className="mt-2 text-sm">
                          <p>{mentorshipAppointment.hackerDescription}</p>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>

                    {mentorshipAppointment.offlineLocation && (
                      <div className="border p-4 rounded-lg">
                        <h3 className="font-semibold">Hacker Location</h3>

                        <p className="mt-2">Location: {mentorshipAppointment.offlineLocation}</p>
                      </div>
                    )}
                  </div>
                  <div className="h-2"></div>
                  <MentorEditAppointmentComponent mentorshipAppointment={mentorshipAppointment} />
                </DialogContent>
              </Dialog>
              <div className="flex flex-col gap-2 items-center text-sm">

                <Button
                  variant={config.buttonVariant}
                  className="w-full"
                  disabled={config.buttonDisabled}
                  asChild
                >
                  <a href={MENTORSHIP_ZOOM_LINK} target="_blank" rel="noopener noreferrer">
                    <img src="/images/icons/zoom-icon.svg" width={32} height={32} className="h-6" />
                  </a>
                </Button>
                <span className="text-xs text-center">{config.buttonText}</span>
              </div>

            </div>
          </div>
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
              {appointmentState === 'ongoing' ? (
                <div className="p-4">
                  <p className="font-semibold mb-2 text-green-400">Your mentorship session is currently active!</p>
                  {mentorshipAppointment.location === 'online' ? (
                    <ol className="list-decimal pl-4">
                      <li>Click "Join Now" to enter the Zoom meeting</li>
                      <li>Use the Breakout Room designated for your session</li>
                      <li>Have a great mentoring session!</li>
                    </ol>
                  ) : (
                    <ol className="list-decimal pl-4">
                      <li>Head to your confirmed meeting location</li>
                      <li>Or use the Zoom link as a backup option</li>
                      <li>Have a great mentoring session!</li>
                    </ol>
                  )}
                </div>
              ) : appointmentState === 'completed' ? (
                <div className="p-4">
                  <p className="font-semibold mb-2 text-gray-400">This mentorship session has ended.</p>
                  <p>Thank you for your mentoring contribution!</p>
                </div>
              ) : (
                <ol className="list-decimal p-4">
                  {mentorshipAppointment.location === 'online' ? (
                    <>
                      <li>Ideally, hacker will reach you out on Discord first.</li>
                      <li>When they do so, please confirm whether the mentorship will be conducted via Zoom or another communication platform.</li>
                      <li>You can always use the Zoom link by joining the Breakout Room designated for you.</li>
                    </>
                  ) : (
                    <>
                      <li>Ideally, hacker will reach you out on Discord first.</li>
                      <li>Discuss with the hacker to confirm the location of your meeting in the venue.</li>
                      <li>You may use the Zoom link instead and join the Breakout Room designated for you. The decision is up to you and the hacker.</li>
                    </>
                  )}
                </ol>
              )}
            </AlertDescription>
          </Alert>
        </CollapsibleContent>
      </Collapsible>
    </div>




  )
}