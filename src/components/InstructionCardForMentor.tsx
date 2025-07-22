export default function InstructionCardForMentorComponent(
  { user }: { user: any }
) {
  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h1 className="text-xl font-bold">Hello, {user?.displayName}!</h1>
        <h2 className="text-lg">Welcome to Garuda Hacks 6.0!</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg flex flex-col">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            📋 General Instructions
          </h4>

          <ul className="my-6 ml-6 list-decimal [&>li]:mt-2">
            <li>View all your upcoming and recent schedules on this portal.</li>
            <li>The mentorship period is open from July 24 at 2:00 PM to July 25 at 8:00 PM.</li>
            <li>Hackers can book mentorship slots starting at 1:00 PM on July 24.</li>
            <li>Your mentorship slots have been created based on the availability you provided in our form. To change your schedule, please contact us.</li>
            <li>Each mentorship slot is scheduled for 15 minutes. Please be mindful of the time during each session.</li>
            <li>Hackers must book at least 30 minutes in advance. You will receive an email notification when a hacker books a slot with you.</li>
            <li>Hackers can cancel an appointment at least 45 minutes in advance. You will receive an email notification if a hacker cancels.</li>
            <li>You can mark a schedule as completed once the mentorship session is finished.</li>
            <li>You can add comments to each schedule before or after appointments.</li>
            <li>You can mark a schedule as AFK if a hacker does not attend.</li>
          </ul>
        </div>

        <div className="p-4 border rounded-lg flex flex-col">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            💬 Ways of Communication
          </h4>

          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Regardless of your location preference (online or offline), we will provide a Zoom link with a designated Breakout Room for your use. Discord can be used for asynchronous communication before or after your mentorship appointment.
          </p>

          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-10">
            📍 Offline
          </h4>
          <ul className="my-2 ml-6 list-decimal [&>li]:mt-2">
            <li>Hackers will provide their on-site location in the mentorship appointment details.</li>
            <li>If you prefer to meet elsewhere, please discuss this directly with the hackers.</li>
          </ul>

          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-10">
            🌐 Online
          </h4>
          <ul className="my-2 ml-6 list-decimal [&>li]:mt-2">
            <li>Hackers should contact you on Discord first to agree on a communication method.</li>
            <li>You may discuss with the hackers which platform you both prefer to use (e.g., Discord, Zoom).</li>
          </ul>
        </div>

        <div className="p-4 border rounded-lg flex flex-col">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            🏫 Are you coming on-site?
          </h4>

          <p className="leading-7 [&:not(:first-child)]:mt-6">
            If you have marked your slot as offline, please note that Universitas Multimedia Nusantara's gate closes at 10:00 PM and reopens at 6:00 AM. Be mindful of your commute time if you plan to leave the venue overnight. To change any mentorship slots' offline/online availability, please inform us before July 24.
          </p>
        </div>

        <div className="p-4 border rounded-lg flex flex-col">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            🙋 Need Help? Contact Us
          </h4>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Raise your questions in the mentor Discord channel or contact us directly.
          </p>
          <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
            <li>Discord: _heryan (Ryan)</li>
            <li>WhatsApp: +6281224158369 (Ryan)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}