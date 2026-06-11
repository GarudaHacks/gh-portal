import { Button } from "@/components/ui/button";
import { PortalConfig } from "@/utils/portalConfig";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

// Force applications closed
const applicationsOpen = true;

interface ApplyNowProps {
  portalConfig: PortalConfig | null
}

export default function ApplyNow({ portalConfig } : ApplyNowProps) {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-primary">
        Applications are{" "}
        {applicationsOpen ? "open!" : "currently closed."}
      </h2>
      <div className="flex flex-col gap-4 border-gray-600 bg-opacity-10 bg-white/5 backdrop-blur-md border-2 p-4 rounded-2xl shadow-md">
        <p className="font-medium">
          <span className="mb-2">
            Apply by{" "}
            <b>
              {portalConfig
                ? format(
                  portalConfig.applicationCloseDate,
                  "MMMM d, yyyy"
                )
                : ""}
            </b>{" "}
            for a spot at Garuda Hacks 6.0.
          </span>
          <br />
          <span className="font-bold">Date:</span>{" "}
          {portalConfig
            ? format(portalConfig.hackathonStartDate, "MMMM d, yyyy")
            : ""}
          -{" "}
          {portalConfig
            ? format(portalConfig.hackathonEndDate, "MMMM d, yyyy")
            : ""}
          <br />
          <span className="font-bold">Venue:</span> Universitas
          Multimedia Nusantara (UMN).
        </p>
        <Button
          className={`w-fit ${!applicationsOpen ? "opacity-90 cursor-not-allowed" : ""
            }`}
          disabled={!applicationsOpen}
          onClick={() => navigate("/application")}
        >
          Apply Now
        </Button>
      </div>
    </div>
  )
}