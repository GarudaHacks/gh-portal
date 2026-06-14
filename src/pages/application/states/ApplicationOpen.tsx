import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react"
import applicationCalendar from "/assets/application-calendar.png"
import { PortalConfig } from "@/utils/portalConfig"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

interface ApplicationOpenProps {
  portalConfig: PortalConfig | null
}

export default function ApplicationOpen({ portalConfig }: ApplicationOpenProps) {
  const navigate = useNavigate()
  return (
    <div className="w-full p-8 border border-tertiary grid grid-cols-1 lg:grid-cols-5 gap-10 bg-white rounded-xl border-tertiary-glow">
      <div className="hidden lg:block p-4 bg-tertiary/10 rounded-xl aspect-square">
        <img src={applicationCalendar} alt="Calendar" width={300} height={300} className="" />
      </div>

      <div className="col-span-4 flex flex-col gap-6 lg:gap-4">
        <div className="flex lg:flex-row items-center justify-center lg:justify-start gap-2 py-1 px-3 bg-tertiary/10 w-full lg:w-fit rounded-xl">
          <span className="text-green-500 animate-pulse text-3xl">•</span>
          <span className="font-semibold text-tertiary">Applications are open!</span>
        </div>

        <div className="flex flex-row items-center gap-4">
          <div className="p-2.5 rounded-xl bg-tertiary/10 text-tertiary w-fit">
            <Calendar size={20} />
          </div>
          <p className="flex flex-col lg:flex-row gap-2"><span className="font-semibold text-sm lg:text-base">Apply By :</span> <span>{(portalConfig?.applicationCloseDate || new Date('2026-07-01')).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span></p>
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

        <div className="flex w-full justify-end">
          <Button
            className={`w-full lg:w-fit ${!portalConfig?.applicationsOpen ? "opacity-90 cursor-not-allowed" : ""
              }`}
            disabled={!portalConfig?.applicationsOpen}
            onClick={() => navigate("/application")}
            size={"lg"}
          >
            Apply Now <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  )
}