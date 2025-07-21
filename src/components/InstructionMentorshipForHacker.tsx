import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"

export default function InstructionMentorshipForHacker() {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"link"} className="text-white">
            Read Mentorship Guide
          </Button>
        </DialogTrigger>
        <DialogContent className="text-white">
          <DialogHeader>
            <DialogTitle className="text-white">📋 Mentorship Guide</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
            <div className="p-4 border rounded-lg flex flex-col">
              <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
                General Instructions
              </h4>

              <div className="max-h-screen overflow-y-scroll">
                <ul className="my-6 ml-6 list-decimal [&>li]:mt-2">
                  <li>Mentorship slots are available on a first-come, first-served basis.</li>
                  <li>Only one team member needs to sign up for a mentorship slot, and the appointment will be booked under their name.</li>
                  <li>Bookings must be made at least 30 minutes before the scheduled mentorship start time.</li>
                  <li>You may book up to two slots at a time. Your quota resets after the scheduled time has passed.</li>
                  <li>You may reserve two consecutive slots if available.</li>
                  <li>Cancellations are allowed up to 45 minutes before the session starts. Failure to attend without canceling may result in being marked as absent (AFK), which could prevent you from booking future mentorship sessions.</li>
                  <li>Some mentors are available online, while others are available in person. Discuss the meeting format with your mentor.</li>
                  <li>Regardless of the mentor's availability, you may use our Zoom breakout rooms for virtual meetings if preferred.</li>
                </ul>
              </div>
            </div>
            <div className="p-4 border rounded-lg flex flex-col">
              <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
                🟢 Do
              </h4>

              <div className="max-h-screen overflow-y-scroll">
                <ul className="my-6 ml-6 list-decimal [&>li]:mt-2">
                  <li>Prepare questions in advance to make the most of your limited time with the mentor.</li>
                  <li>Be accountable for your booking, as mentors will confirm your attendance in our system.</li>
                </ul>
              </div>
            </div>
            <div className="p-4 border rounded-lg flex flex-col">
              <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
                🚩 Don't
              </h4>

              <div className="max-h-screen overflow-y-scroll">
                <ul className="my-6 ml-6 list-decimal [&>li]:mt-2">
                  <li>Show disrespect toward mentors.</li>
                  <li>Request direct contributions to your codebase, monetary support, tools, or similar assistance.</li>
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}