import { Separator } from "@/components/ui/separator";
import { eventName } from "@/config";
import garudieThankYou from "/assets/garudie-thank-you.png"

export default function ApplicationClosed() {
  return (
    <div className="text-center">
      <Separator className="mb-6" />
      <div className="flex flex-col gap-4 bg-white border border-tertiary p-4 rounded-xl items-center container text-pretty w-full">
        <div className="max-w-xl mx-auto flex flex-col items-center">
          <img src={garudieThankYou} alt="Thank You" width={350} height={350} className="" />
          <h1 className="text-2xl font-bold mb-6">Application is now closed</h1>
          <p>Thank you for your interest in joining {eventName}</p>
          <p>We received a lot of applications and enthusiasm for our event. We hope to see you next year!</p>
          <div className="mt-6 font-semibold">
            <p>Regards,</p>
            <p>GHQ</p>
          </div>
        </div>
      </div>
    </div>
  )
}