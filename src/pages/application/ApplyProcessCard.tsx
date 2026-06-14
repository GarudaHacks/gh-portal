import { useAuth } from "@/context/AuthContext";
import { PortalConfig } from "@/utils/portalConfig";
import garudieRocket from "/assets/garudie-rocket.png"
import ApplicationOpen from "./states/ApplicationOpen";
import ApplicationOpenSoon from "./states/ApplicationOpenSoon";

interface ApplyProcessCardProps {
  portalConfig: PortalConfig | null
}

export default function ApplyProcessCard({ portalConfig }: ApplyProcessCardProps) {
  const { user } = useAuth()

  function getCurrentProcess() {
    const currentDate = new Date()
    if (user?.status === "submitted") return "submitted"
    if (portalConfig?.applicationStartDate! > new Date()) return "soon"
    if (!portalConfig?.applicationsOpen && portalConfig?.applicationStartDate! < currentDate) return "open"
  }

  const currentProcess = getCurrentProcess()

  return (
    <div className="flex flex-col gap-10 text-pretty p-4">
      <div className="flex justify-between items-center">
        <div className="flex-1 flex flex-col gap-4">
          <div className="absolute right-4 top-12 lg:relative">
            <img src={garudieRocket} width={300} height={300} className="w-24 lg:w-54 block lg:hidden mb-6 lg:mb-0" />
          </div>
          <div className="flex flex-col justify-start items-start gap-2">
            <h2 className="font-bold text-2xl lg:text-3xl">Hello {user?.displayName}! 👋</h2>
            <p>Welcome to Garuda Hacks Portal! <br /> You can view all announcements, events, and everything you need to know here.</p>
          </div>
        </div>
        <img src={garudieRocket} width={300} height={300} className="w-24 lg:w-64 hidden lg:block" />
      </div>

      {currentProcess === "soon" && <ApplicationOpen portalConfig={portalConfig} />}
      {currentProcess === "open" && <ApplicationOpenSoon portalConfig={portalConfig} />}
    </div>
  )
}