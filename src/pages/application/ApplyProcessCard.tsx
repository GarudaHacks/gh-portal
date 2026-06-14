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
      
      {/* Open Soon -> applicationStartDate<now */}
      {!portalConfig?.applicationsOpen && portalConfig?.applicationStartDate! < new Date() && <ApplicationOpen portalConfig={portalConfig} />}
      {portalConfig?.applicationStartDate! > new Date() && <ApplicationOpenSoon portalConfig={portalConfig} />}
    </div>
  )
}