import { useEffect, useState } from "react"
import { MentorshipAppointmentResponseAsHacker } from "@/types/mentorship"
import { Badge } from "./ui/badge"
import { Calendar, ChevronDown, Clock, Loader2, MapPin, Video, X } from "lucide-react"
import { titleCase } from "title-case";
import Countdown, { zeroPad } from 'react-countdown';
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cancelMentorshipAppointment } from "@/lib/http/mentorship"
import toast from "react-hot-toast"
import { MENTORSHIP_ZOOM_LINK } from "@/utils/portalConfig"
import { formatSpecialization } from "@/utils/stringUtils"

interface MentorshipAppointmentCardComponentProps {
  mentorshipAppointment: MentorshipAppointmentResponseAsHacker
}

const countdownRenderer = ({ hours, minutes, seconds, completed }: { hours: number, minutes: number, seconds: number, completed: boolean }) => {
  if (completed) {
    return <span className="text-2xl font-semibold text-tertiary tabular-nums">Session started</span>;
  }
  return (
    <span className="text-2xl font-semibold text-tertiary tabular-nums">
      {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
    </span>
  );
};

export default function MentorshipAppointmentCardComponent(
  { mentorshipAppointment }: MentorshipAppointmentCardComponentProps
) {
  const [loading, setLoading] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const [showInstructions, setShowInstructions] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const isOnline = mentorshipAppointment.location === 'online';
  const joinLink = mentorshipAppointment.meetLink || MENTORSHIP_ZOOM_LINK;
  const isPast = now >= mentorshipAppointment.startTime * 1000;

  const startDate = new Date(mentorshipAppointment.startTime * 1000);
  const endDate = new Date(mentorshipAppointment.endTime * 1000);
  const dateLabel = startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeLabel = `${startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;

  const handleCancelAppointment = async () => {
    setLoading(true)
    try {
      const payload = {
        id: mentorshipAppointment.id
      };
      const res = await cancelMentorshipAppointment(payload);
      toast.success(res.message || "Mentorship session canceled.");
      setTimeout(() => {
        window.location.reload();
      }, 2000)
    } catch (error: any) {
      console.error("Error canceling mentorship:", error);
      toast.error(error.message || "Failed to cancel mentorship session");
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-tertiary/20 bg-white rounded-xl flex flex-col">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mentor info */}
        <div className="flex-1 flex flex-col gap-2 p-4">
          <h3 className="font-bold text-xl">{mentorshipAppointment.mentorName || "Mentor"}</h3>
          {mentorshipAppointment.mentorTitle && (
            <p className="text-sm">{titleCase(mentorshipAppointment.mentorTitle || "")}</p>
          )}
          <p className="text-muted-foreground text-sm">
            {mentorshipAppointment.mentorEmail && (
              <span>{mentorshipAppointment.mentorEmail}</span>
            )}{" | "}
            {mentorshipAppointment.mentorDiscordUsername && (
              <span>Discord: {mentorshipAppointment.mentorDiscordUsername}</span>
            )}
          </p>
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
        <div className="flex-1 flex flex-col gap-3 justify-between bg-tertiary/5 p-4">
          <p className="text-xs text-muted-foreground">ID {mentorshipAppointment.id}</p>
          <div className="flex flex-col gap-3">
            <p className="text-sm">Session starts in</p>
            <Countdown date={mentorshipAppointment.startTime * 1000} renderer={countdownRenderer} />
            <div className="flex flex-col gap-2">
              <Badge variant="outline" className="border-0 bg-tertiary/10 text-tertiary flex items-center gap-1">
                {titleCase(mentorshipAppointment.location)} Session
              </Badge>
              {mentorshipAppointment.offlineLocation && <p className="text-xs flex flex-row gap-1 items-center text-gray-500"><MapPin size={16} />{mentorshipAppointment.offlineLocation}</p>}
            </div>
          </div>

          <div className="flex gap-2 w-full justify-end">
            {isOnline && (
              <Button variant="outline" className="gap-2" asChild>
                <a href={joinLink} target="_blank" rel="noopener noreferrer">
                  <Video size={16} /> Google Meet
                </a>
              </Button>
            )}

            {!isPast && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <X size={16} /> Cancel Session
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel Mentorship Session</DialogTitle>
                    <DialogDescription>
                      You can cancel your mentorship session up to 45 minutes before the appointment.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="destructive" className="flex gap-2 items-center" onClick={handleCancelAppointment} disabled={loading}>
                      Confirm Cancellation
                      {loading && <Loader2 className="animate-spin" size={16} />}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
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
          isOnline ? (
            <ol className="list-decimal ml-4 text-sm text-muted-foreground flex flex-col gap-2">
              <li>By default you can use the provided Google Meet link.</li>
              <li>There is also an email you can use to contact the mentor prior to the booking time, or as a follow-up after the mentoring session ends.</li>
            </ol>
          ) : (
            <ol className="list-decimal ml-4 text-sm text-muted-foreground flex flex-col gap-2">
              <li>Contact your mentor through email or Discord to confirm the location before the session starts.</li>
            </ol>
          )
        )}
      </div>
    </div>
  )
}
