import GarudieWelcome from "@/components/GarudieWelcome"
import garudieSorry from "/assets/garudie-sorry.png"
import { Separator } from "@/components/ui/separator"

export default function ApplicationRejected() {
  return (
    <div className="flex flex-col gap-10 text-pretty p-4">
      <GarudieWelcome />
      <Separator />
      <div className="bg-white p-8 shadow-md flex flex-col gap-4 max-w-2xl mx-auto text-pretty">
        <h2 className="text-center font-bold text-3xl">Thank You For Applying</h2>
        <div className="h-6"></div>
        <p>
          We appreciate your interest in Garuda Hacks 7.0, and have carefully reviewed your application. However, we regret to inform you that <span className="font-bold">we are unable to offer you a spot this year</span>.
        </p>
        <p>The selection process was highly competitive, and we encourage to apply again next year. Thank you for your passion and effort, and we wish you good luck in the future endeavor!</p>
        <div className="flex justify-center">
          <img src={garudieSorry} alt="Garudie Sorry" className="w-64 lg:w-96" />
        </div>
        <div>
          <p>Regards,</p>
          <p className="font-semibold">Garuda Hacks 7.0 Committee</p>
        </div>
      </div>
    </div>
  )
}