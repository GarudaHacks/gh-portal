export default function HomeStatusNotRsvpd() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-primary">
        Your Application Status
      </h1>
      <div className="flex flex-col gap-4 bg-white border-primary border-2 p-4 rounded-2xl shadow-md">
        <p>Your application is being reviewed.</p>
        <p>We will release acceptances on Jun 20th, 2025. </p>
      </div>
    </div>
  );
}
