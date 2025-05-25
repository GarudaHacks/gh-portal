import GlassyRectangleBackground from "./RedGradientBackground"
import { dates } from "@/assets/data/copywriting";
import { format } from "date-fns";

export default function HomeStatusNotRsvpd() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-primary">
        Your Application Status
      </h1>
      <GlassyRectangleBackground>
        <p>Your application is being reviewed.</p>
        <p>We will release acceptances on a rolling basis starting from {format(new Date(dates.applicationCloseDate), "MMMM d, yyyy")}. </p>
      </GlassyRectangleBackground>
    </div>
  );
}
