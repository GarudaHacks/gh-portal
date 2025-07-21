export default function InstructionCardForMentorComponent(
  {user} : {user:any}
) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">Hello, {user?.displayName}!</h1>
        <h2 className="text-lg">Welcome to Garuda Hacks 6.0!</h2>
      </div>

      <div className="p-4 border rounded-lg flex flex-col">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          📋 General Instructions
        </h4>

        <ul className="my-6 ml-6 list-decimal [&>li]:mt-2">
          <li>Find all your upcoming and recent schedules on this portal.</li>
          <li>Hackers can book mentorship slots once the mentorship period opens. Please note that hackers will book you by your individual name, not by your team's name.</li>
          <li>Your mentorship slots have already been created based on the availability you provided in our form. If you wish to change your schedule, please contact us.</li>
          <li>Each mentorship slot is scheduled for 15 minutes. Please be mindful of the time during each session.</li>
          <li>Hackers must book at least 30 minutes in advance. You will receive an email notification when a hacker books a slot with you.</li>
        </ul>
      </div>

      <div className="p-4 border rounded-lg flex flex-col">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          💬 Ways of Communication
        </h4>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Regardless of your location preference (online or offline), we will provide a Zoom link with a designated Breakout Room for you to use. Discord can be used for asynchronous communication before or after your mentorship appointment.
        </p>

        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-10">
          📍 Offline
        </h4>
        <ul className="my-2 ml-6 list-decimal [&>li]:mt-2">
          <li>Hackers will provide their on-site location in the mentorship appointment details.</li>
          <li>If you wish to meet elsewhere, please discuss this directly with the hackers.</li>
        </ul>

        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-10">
          🌐 Online
        </h4>
        <ul className="my-2 ml-6 list-decimal [&>li]:mt-2">
          <li>Ideally, hackers will contact you on Discord first to decide on a communication method.</li>
          <li>You are free to discuss with the hackers which platform you would both prefer to use (e.g., Discord, Zoom).</li>
        </ul>
      </div>

      <div className="p-4 border rounded-lg flex flex-col">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          🙋 Need Help? Contact Us
        </h4>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Raise your questions in the mentor discord channel or contact us directly.
        </p>
        <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
          <li>Discord: _heryan (Ryan)</li>
          <li>WhatsApp: +6281224158369 (Ryan)</li>
        </ul>
      </div>
    </div>
  )
}