import GlassyRectangleBackground from "./RedGradientBackground"

export default function HomeStatusNotRsvpd() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-primary">
        Your Application Status
      </h1>
      <GlassyRectangleBackground>
        <p>Your application is being reviewed.</p>
        <p>We will release acceptances on Jun 20th, 2025. </p>
      </GlassyRectangleBackground>
    </div>
  );
}
