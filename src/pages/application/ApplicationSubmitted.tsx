import { Clock, MapPin, PartyPopper, Search, UserPen, Users } from "lucide-react"
import applicationReview from "/assets/application-review.png"
import { PortalConfig } from "@/utils/portalConfig"
import garudieReview from "/assets/garudie-review.png"
import { useAuth } from "@/context/AuthContext"

interface ApplicationSubmittedProps {
  portalConfig: PortalConfig | null
}

export default function ApplicationSubmitted({ portalConfig }: ApplicationSubmittedProps) {
  const { user } = useAuth()
  return (
    <div className="flex flex-col gap-10 text-pretty p-4">
      <div className="flex justify-between items-center">
        <div className="flex-1 flex flex-col gap-4">
          <div className="absolute right-4 top-12 lg:relative">
            <img src={garudieReview} width={300} height={300} className="w-24 block lg:hidden mb-6 lg:mb-0" />
          </div>
          <div className="flex flex-col justify-start items-start gap-2">
            <h2 className="font-bold text-2xl lg:text-3xl">Hello {user?.displayName}! 👋</h2>
            <p>Welcome to Garuda Hacks Portal! <br /> You can view all announcements, events, and everything you need to know here.</p>
          </div>
        </div>
        <img src={garudieReview} width={300} height={300} className="w-72 hidden lg:block" />
      </div>
      <div className="w-full p-8 border border-tertiary grid grid-cols-1 lg:grid-cols-5 gap-10 bg-white rounded-xl border-tertiary-glow">
        <div className="hidden lg:block p-4 bg-tertiary/10 rounded-xl aspect-square">
          <img src={applicationReview} alt="Hourglass" width={300} height={300} className="" />
        </div>

        <div className="col-span-full lg:col-span-3 flex flex-col gap-6 lg:gap-4">
          <div className="flex lg:flex-row items-center justify-center lg:justify-start gap-2 py-2 px-3 bg-tertiary/10 w-full lg:w-fit rounded-xl">
            <PartyPopper size={16} className="text-tertiary animate-bounce" />
            <span className="font-semibold text-tertiary">Application is submitted</span>
          </div>

          <div className="flex flex-row items-center  gap-4">
            <div className="p-2.5 rounded-xl bg-tertiary/10 text-tertiary w-fit">
              <UserPen size={20} />
            </div>
            <p className="flex flex-col items-start lg:items-center lg:flex-row gap-2"><span className="font-semibold text-sm lg:text-base">Status :</span> <span className="font-semibold text-amber-600 bg-amber-200 py-1 px-2 rounded-xl">Under review</span></p>
          </div>
          <div className="flex flex-row items-center gap-4">
            <div className="p-2.5 rounded-xl bg-tertiary/10 text-tertiary w-fit">
              <Clock size={20} />
            </div>
            <p className="flex flex-col lg:flex-row gap-2"><span className="font-semibold text-sm lg:text-base">Date :</span> <span><span>{portalConfig!.hackathonStartDate!.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span> - <span>{portalConfig!.hackathonEndDate!.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span></span></p>
          </div>
          <div className="flex flex-row items-center gap-4">
            <div className="p-2.5 rounded-xl bg-tertiary/10 text-tertiary w-fit">
              <MapPin size={20} />
            </div>
            <p className="flex flex-col lg:flex-row gap-2"><span className="font-semibold text-sm lg:text-base">Venue : </span> Universitas Multimedia Nusantara (UMN)</p>
          </div>
        </div>
        <div className="bg-tertiary/10 rounded-xl p-6 flex flex-col gap-4">
          <p className="font-bold text-tertiary">What happens next:</p>
          <div className="flex flex-col">
            {[
              { icon: Search, text: "Our team reviews your application carefully." },
              { icon: Users, text: "We'll notify you via email about the result." },
              { icon: PartyPopper, text: "If accepted, we'll see you at Garuda Hacks 7.0!" },
            ].map(({ icon: Icon, text }, i, arr) => (
              <div key={i}>
                <div className="flex gap-4 items-center">
                  <div className="border-2 border-tertiary/50 rounded-xl p-2.5 bg-white/60 shrink-0">
                    <Icon size={20} className="text-tertiary" />
                  </div>
                  <p className="text-xs text-gray-700 leading-snug">{text}</p>
                </div>
                {i < arr.length - 1 && (
                  <div className="ml-[21px] border-l-2 border-dashed border-tertiary/40 h-6 my-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}