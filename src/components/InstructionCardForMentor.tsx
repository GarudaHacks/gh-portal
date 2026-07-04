import { eventName } from "@/config";
import { Link } from "react-router-dom";

export default function InstructionCardForMentorComponent(
  { user }: { user: any }
) {
  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h1 className="text-xl font-bold">Hello, {user?.displayName}</h1>
        <h2 className="text-lg">Welcome to {eventName}</h2>
      </div>
      <p>Thank you for being a part of our mentoring team! To get you started with our mentoring system, please read this guide.</p>
      <div className="flex flex-col gap-4">
        <div className="p-4 border rounded-lg flex flex-col bg-white">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            General
          </h4>
          <ul className="my-6 ml-6 list-decimal [&>li]:mt-2">
            <li>Your mentorship schedules have been created based on the availability you provided in the intake form. To change your schedule, please contact us.</li>
            <li>You can check your upcoming schedules in the <Link to={"/mentoring"} className="underline text-tertiary">Mentoring</Link> tab.</li>
            <li>Check all schedules in the <Link to={"/schedules"} className="underline text-tertiary">Schedules</Link> tab.</li>
            <li>Hackers must book a slot at least 30 minutes in advance. You will receive an email notification when a hacker books a slot with you.</li>
            <li>Hackers may cancel an appointment at least 45 minutes in advance. You will receive an email notification if a hacker cancels.</li>
            <li>Do not forget to join our Discord channel! <a href="https://discord.gg/Ag8tB3tQ" className="underline">https://discord.gg/Ag8tB3tQ</a></li>
          </ul>
        </div>

        <div className="p-4 border rounded-lg flex flex-col bg-white">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Ways of Communication
          </h4>
          <h4 className="scroll-m-20 text-lg font-semibold tracking-tight mt-10">
            Offline
          </h4>
          <ul className="my-2 ml-6 list-decimal [&>li]:mt-2">
            <li>Hackers will provide their on-site location in the mentorship appointment details.</li>
            <li>If you prefer to meet elsewhere, please discuss this directly with the hackers.</li>
          </ul>

          <h4 className="scroll-m-20 text-lg font-semibold tracking-tight mt-10">
            Online
          </h4>
          <ul className="my-2 ml-6 list-decimal [&>li]:mt-2">
            <li>A Google Meet link has been provided on each booking, which you can use to communicate with the hacker.</li>
          </ul>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Discord can be used for asynchronous communication before or after your mentorship appointment.
          </p>

        </div>

        <div className="p-4 border rounded-lg flex flex-col bg-white">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Are you coming on-site?
          </h4>

          <p className="leading-7 [&:not(:first-child)]:mt-6">
            If you have marked your slot as offline, please note that Universitas Multimedia Nusantara's gate closes at 10:00 PM and reopens at 6:00 AM. Be mindful of your commute time if you plan to leave the venue overnight. To change any mentorship slots' offline/online availability, please inform us before July 24.
          </p>
        </div>

        <div className="p-4 border rounded-lg flex flex-col gap-4 bg-white">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Need Help?
          </h4>
          <p>Send an email to <a href="mailto:heryan@garudahacks.com" className="underline">heryan@garudahacks.com</a></p>
        </div>
      </div>
    </div>
  );
}