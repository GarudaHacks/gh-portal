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
import { MapPinCheck, MonitorSmartphone } from "lucide-react"
import { useState } from "react"
import { bookMentorshipAppointment } from "@/lib/http/mentorship"
import toast from "react-hot-toast"

interface MentorshipSlotAsHackerComponentProps {
  mentorshipAppointment: MentorshipAppointment
  isMentorshipOpen: boolean
}

export default function MentorshipSlotAsHackerComponent(
  { mentorshipAppointment, isMentorshipOpen }: MentorshipSlotAsHackerComponentProps
) {
  const [inquiry, setInquiry] = useState<string>('')
  const handleSubmitBook = async () => {
    try {

      if (!mentorshipAppointment.id) {
        toast.error("Mentorship ID is not present.")
        return;
      }
      const response = await bookMentorshipAppointment(mentorshipAppointment.id, inquiry)

      console.log("RES", response)
      toast.success("Successfuly booked mentorship!")
    } catch (error) {
      toast.error(`Error: ${error}`)
    }
  }

  return (
    <div className="border p-4 rounded-xl flex flex-col gap-2 justify-between bg-zinc-500/10">
      <div className="flex flex-row justify-between items-center">

        <div className="flex flex-row gap-2">
          {mentorshipAppointment.hackerId ? (
            <Badge variant={"destructive"}>Booked</Badge>
          ) : (
            <>
              {!isTimeElapsed(mentorshipAppointment.startTime) ? (
                <Badge className="bg-green-500">Available</Badge>
              ) : (
                <Badge variant={"outline"}>Time Elapsed</Badge>
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
      <div>

        <p>{epochToStringDate(mentorshipAppointment.startTime)} - {epochToStringDate(mentorshipAppointment.endTime)} <span className="font-semibold">({(mentorshipAppointment.endTime - mentorshipAppointment.startTime) / 60}) minutes</span></p>
      </div>

      <div className="flex justify-between items-end">

        <div>

        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={!isMentorshipOpen || !!mentorshipAppointment.hackerId || isTimeElapsed(mentorshipAppointment.startTime)}>Book</Button>

          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Book Mentorship</AlertDialogTitle>
              <AlertDialogDescription className="text-white flex flex-col gap-2">
                You will book a mentorship slot with the specified time.

                <p className="">{epochToStringDate(mentorshipAppointment.startTime)} - {epochToStringDate(mentorshipAppointment.endTime)}</p>
                <p>Duration: {(mentorshipAppointment.endTime - mentorshipAppointment.startTime) / 60} Minutes</p>

              </AlertDialogDescription>
            </AlertDialogHeader>

            <Textarea onChange={(e) => setInquiry(e.target.value)} placeholder="Your inquiry here..." className="text-white" />

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmitBook}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>

    </div>
  )
}