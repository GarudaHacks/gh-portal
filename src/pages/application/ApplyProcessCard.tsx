import { useAuth } from "@/context/AuthContext";
import { PortalConfig } from "@/utils/portalConfig";
import garudieRocket from "/assets/garudie-rocket.png"
import ApplicationOpen from "./states/ApplicationOpen";
import ApplicationOpenSoon from "./states/ApplicationOpenSoon";
import GarudieWelcome from "@/components/GarudieWelcome";
import ApplicationClosed from "./states/ApplicationClosed";

interface ApplyProcessCardProps {
  portalConfig: PortalConfig | null
}

export default function ApplyProcessCard({ portalConfig }: ApplyProcessCardProps) {
  const { user } = useAuth()

  function getCurrentProcess() {
    const currentDate = new Date()
    if (user?.status === "submitted") return "submitted"
    if (portalConfig?.applicationStartDate! > new Date()) return "soon"
    if (portalConfig?.applicationsOpen && portalConfig?.applicationStartDate! < currentDate && portalConfig?.applicationCloseDate! > currentDate) return "open"
    if (!portalConfig?.applicationsOpen || portalConfig?.applicationCloseDate! < currentDate) return "closed"
  }

  const currentProcess = getCurrentProcess()

  return (
    <div className="flex flex-col gap-10 text-pretty p-4 overflow-hidden">
      <GarudieWelcome image={garudieRocket} imageTopPosition={4} imageRightPosition={0} imageSizing="w-24 lg:w-64" />
      {currentProcess === "soon" && <ApplicationOpenSoon portalConfig={portalConfig} />}
      {currentProcess === "open" && <ApplicationOpen portalConfig={portalConfig} />}
      {currentProcess === "closed" && <ApplicationClosed />}
    </div>
  )
}