import { MentorshipAppointment } from "@/types/mentorship"
import { Button } from "./ui/button"
import { epochToStringDate, isTimeElapsed } from "@/utils/dateUtils"
import { Badge } from "./ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from "./ui/textarea"
import { MapPinCheck, MonitorSmartphone, Video } from "lucide-react"
import { useState } from "react"
import { bookMentorshipAppointment } from "@/lib/http/mentorship"
import toast from "react-hot-toast"
import { Separator } from "./ui/separator"

interface MentorshipSlotAsMentorComponentProps {
  mentorshipAppointment: MentorshipAppointment
}

export default function MentorshipSlotAsMentorComponent(
  { mentorshipAppointment }: MentorshipSlotAsMentorComponentProps
) {

  return (
    <div className="border p-4 rounded-lg flex flex-col gap-2 justify-between bg-blue-950">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2">
          {mentorshipAppointment.hackerId ? (
            <Badge variant={"destructive"}>Booked</Badge>
          ) : (
            <>
              {!isTimeElapsed(mentorshipAppointment.startTime) ? (
                <Badge className="bg-green-500">Available</Badge>
              ) : (
                <Badge variant={"outline"} className="text-white">Passed</Badge>
              )}
            </>
          )}

          <Badge className="text-xs flex flex-row items-center gap-1">{mentorshipAppointment.location.toUpperCase()}
            {mentorshipAppointment.location === 'online' ? (
              <MonitorSmartphone size={16} />
            ) : (
              <MapPinCheck size={16} />
            )}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">Mentorship ID: {mentorshipAppointment.id}</p>
      </div>

      <div className="py-8">
        <p>Request by: Hacker A</p>
      </div>

      <div>
        <p>{epochToStringDate(mentorshipAppointment.startTime)} - {epochToStringDate(mentorshipAppointment.endTime)} <span className="font-semibold">({(mentorshipAppointment.endTime - mentorshipAppointment.startTime) / 60}) minutes</span></p>

        <div className="flex flex-row items-center gap-1 py-3 text-sm">
          <Video />
          <Button variant={"link"} className="p-0">https://zoom.us</Button>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-2 text-sm">
        <p className="font-semibold text-sm text-muted">Hacker Description</p>
        <p>Help me to debug...</p>
        {mentorshipAppointment.hackerDescription && (
          <div>
            <p>{mentorshipAppointment.hackerDescription}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button variant={"outline"}>Mark as Done</Button>
      </div>

    </div>
  )
}