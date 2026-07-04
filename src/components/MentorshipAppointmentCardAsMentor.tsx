import { useMemo, useState } from "react"
import { MentorshipAppointmentResponseAsMentor } from "@/types/mentorship"
import { Badge } from "./ui/badge"
import { Calendar, CheckCheck, ChevronDown, Clock, Flag, MapPin, Video } from "lucide-react"
import { titleCase } from "title-case";
import Countdown, { zeroPad } from 'react-countdown';
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import MentorEditAppointmentComponent from "./MentorEditAppointmentComponent"

interface MentorshipAppointmentCardComponentProps {
  mentorshipAppointment: MentorshipAppointmentResponseAsMentor
}

type AppointmentState = 'upcoming' | 'ongoing' | 'completed';

const getAppointmentState = (startTime: number, endTime: number): AppointmentState => {
  const now = Date.now() / 1000;

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
    return <span className="text-2xl font-semibold text-tertiary tabular-nums">Starting now...</span>;
  }
  return (
    <span className="text-2xl font-semibold text-tertiary tabular-nums">
      {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
    </span>
  );
};

const OngoingRenderer = ({ hours, minutes, seconds, completed }: { hours: number, minutes: number, seconds: number, completed: boolean }) => {
  if (completed) {
    return <span className="text-2xl font-semibold text-green-600 tabular-nums">Session ended</span>;
  }
  return (
    <span className="text-2xl font-semibold text-green-600 tabular-nums">
      {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
    </span>
  );
};

export default function MentorshipAppointmentCardAsMentorComponent(
  { mentorshipAppointment }: MentorshipAppointmentCardComponentProps
) {
  const [showInstructions, setShowInstructions] = useState(true)

  const appointmentState = useMemo(() =>
    getAppointmentState(mentorshipAppointment.startTime, mentorshipAppointment.endTime),
    [mentorshipAppointment.startTime, mentorshipAppointment.endTime]
  );

  const isOnline = mentorshipAppointment.location === 'online';
  const isBooked = !!mentorshipAppointment.hackerId;

  const startDate = new Date(mentorshipAppointment.startTime * 1000);
  const endDate = new Date(mentorshipAppointment.endTime * 1000);
  const dateLabel = startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeLabel = `${startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;

  const getStateConfig = () => {
    switch (appointmentState) {
      case 'upcoming':
        return {
          borderColor: 'border-tertiary/20',
          statusBadge: <Badge variant="outline" className="text-tertiary border-tertiary/40"><Clock size={14} />Upcoming</Badge>,
          countdownLabel: 'Session starts in',
          countdown: <Countdown date={mentorshipAppointment.startTime * 1000} renderer={UpcomingRenderer} />,
        };
      case 'ongoing':
        return {
          borderColor: 'border-green-500',
          statusBadge: <Badge variant="outline" className="text-green-600 border-green-500 animate-pulse"><Video size={14} />Live</Badge>,
          countdownLabel: 'Session ends in',
          countdown: <Countdown date={mentorshipAppointment.endTime * 1000} renderer={OngoingRenderer} />,
        };
      case 'completed':
        return {
          borderColor: 'border-tertiary/20',
          statusBadge: <></>,
          countdownLabel: 'Session status',
          countdown: <span className="text-2xl font-semibold text-gray-400 tabular-nums">Completed</span>,
        };
    }
  };

  const config = getStateConfig();

  return (
    <div className={`border ${config.borderColor} bg-white rounded-xl flex flex-col w-full`}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Hacker / team info */}
        <div className="flex-1 flex flex-col gap-2 p-4">
          <div className="flex items-center gap-2 flex-wrap">
            {isBooked ? (
              <></>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">Not Booked</Badge>
            )}
            {config.statusBadge}
            {mentorshipAppointment.mentorMarkAsDone && (
              <Badge variant="outline" className="text-green-600 border-green-500"><CheckCheck size={14} />Marked as Done</Badge>
            )}
            {mentorshipAppointment.mentorMarkAsAfk && (
              <Badge variant="outline" className="text-yellow-600 border-yellow-500"><Flag size={14} />Marked as AFK</Badge>
            )}
          </div>
          <h3 className="font-bold text-xl">{mentorshipAppointment.teamName || "Awaiting booking"}</h3>
          {mentorshipAppointment.hackerName && (
            <p className="text-sm text-muted-foreground">{mentorshipAppointment.hackerName}</p>
          )}
          <div className="flex items-center gap-2 text-sm mt-2">
            <Calendar size={16} className="text-tertiary shrink-0" />
            {dateLabel}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock size={16} className="text-tertiary shrink-0" />
            {timeLabel}
          </div>
        </div>

        {/* Countdown + actions */}
        {isBooked && (
          <div className="flex-1 flex flex-col gap-3 justify-between bg-tertiary/5 p-4">
            <p className="text-xs text-muted-foreground">ID {mentorshipAppointment.id}</p>
            <div className="flex flex-col gap-3">
              <p className="text-sm">{config.countdownLabel}</p>
              {config.countdown}
              <div className="flex flex-col gap-2">
                <Badge variant="outline" className="border-0 bg-tertiary/10 text-tertiary flex items-center gap-1">
                  {titleCase(mentorshipAppointment.location)} Session
                </Badge>
                {mentorshipAppointment.offlineLocation && <p className="text-xs flex flex-row gap-1 items-center text-gray-500"><MapPin size={16} />{mentorshipAppointment.offlineLocation}</p>}
              </div>
            </div>

            <div className="flex gap-2 w-full justify-end">
              <Button variant="outline" className="gap-2" disabled={appointmentState === 'completed'} asChild>
                <a href={mentorshipAppointment.meetLink} target="_blank" rel="noopener noreferrer">
                  <Video />
                  Google Meet
                </a>
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" className="gap-2">
                    Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-scroll">
                  <DialogHeader>
                    <DialogTitle>Mentorship Detail</DialogTitle>
                    <p className="text-xs text-muted-foreground">Ref ID: {mentorshipAppointment.id}</p>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>

                  <div className="flex flex-col gap-4">
                    <div className="border border-tertiary/20 p-4 rounded-lg">
                      <h3 className="font-semibold">Hacker and Team Detail</h3>
                      <div className="mt-2 text-sm flex flex-col gap-1">
                        <p>Hacker Name: {mentorshipAppointment.hackerName}</p>
                        <p>Team Name: {mentorshipAppointment.teamName}</p>
                      </div>
                    </div>

                    <div className="border border-tertiary/20 p-4 rounded-lg">
                      <h3 className="font-semibold">Hacker Inquiry</h3>
                      {mentorshipAppointment.hackerDescription ? (
                        <p className="mt-2 text-sm">{mentorshipAppointment.hackerDescription}</p>
                      ) : (
                        <p className="text-muted-foreground text-sm mt-2">No inquiry provided.</p>
                      )}
                    </div>

                    {mentorshipAppointment.offlineLocation && (
                      <div className="border border-tertiary/20 p-4 rounded-lg">
                        <h3 className="font-semibold">Hacker Location</h3>
                        <p className="mt-2 text-sm">Location: {mentorshipAppointment.offlineLocation}</p>
                      </div>
                    )}
                  </div>
                  <div className="h-2"></div>
                  <MentorEditAppointmentComponent mentorshipAppointment={mentorshipAppointment} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="flex flex-col gap-2 p-4 border-t border-tertiary/20">
        <button
          type="button"
          onClick={() => setShowInstructions((prev) => !prev)}
          className="flex items-center justify-between gap-2 text-left"
          aria-expanded={showInstructions}
        >
          <p className="font-semibold text-sm">{titleCase(mentorshipAppointment.location)} Instructions</p>
          <ChevronDown
            size={16}
            className={`text-tertiary shrink-0 transition-transform ${showInstructions ? "rotate-180" : ""}`}
          />
        </button>
        {showInstructions && (
          appointmentState === 'ongoing' ? (
            <ol className="list-decimal ml-4 text-sm text-muted-foreground flex flex-col gap-2">
              {isOnline ? (
                <>
                  <li>Click "Zoom" to enter the Zoom meeting.</li>
                  <li>Use the Breakout Room designated for your session.</li>
                  <li>Have a great mentoring session!</li>
                </>
              ) : (
                <>
                  <li>Head to your confirmed meeting location.</li>
                  <li>Or use the Zoom link as a backup option.</li>
                  <li>Have a great mentoring session!</li>
                </>
              )}
            </ol>
          ) : appointmentState === 'completed' ? (
            <ol className="list-decimal ml-4 text-sm text-muted-foreground flex flex-col gap-2">
              <li>This mentorship session has ended. Thank you for your mentoring contribution!</li>
              <li>Use the "Details" button to leave notes or mark this session as done or AFK.</li>
            </ol>
          ) : (
            <ol className="list-decimal ml-4 text-sm text-muted-foreground flex flex-col gap-2">
              <li>Ideally, the hacker will reach out to you on Discord first.</li>
              {isOnline ? (
                <>
                  <li>When they do, confirm whether the mentorship will be conducted via Zoom or another communication platform.</li>
                  <li>You can always use the Zoom link by joining the Breakout Room designated for you.</li>
                </>
              ) : (
                <>
                  <li>Discuss with the hacker to confirm the location of your meeting in the venue.</li>
                  <li>You may use the Zoom link instead and join the Breakout Room designated for you. The decision is up to you and the hacker.</li>
                </>
              )}
            </ol>
          )
        )}
      </div>
    </div>
  )
}
