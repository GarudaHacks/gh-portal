import RedGradientBackground from "./RedGradientBackground";
import { Button } from "./ui/button";

export default function ApplicationSubmitted() {
  return (
    <div className="p-4 flex flex-col items-center gap-4 lg:gap-6 w-full">
      <RedGradientBackground className="w-full p-4 rounded-2xl flex flex-col gap-4 text-white shadow-md">
        <h1 className="text-2xl font-bold">Hooray! Thanks for applying.</h1>

        <p>Your application has been submitted.</p>

        <p>
          We will release decisions by Jun 20th 2025. Stay tuned for any emails
          from us!
        </p>
      </RedGradientBackground>

      <Button
        className="w-full lg:w-fit place-self-end font-semibold"
        size="lg"
        onClick={() => {}}
      >
        Go to dashboard
        <img
          src="/images/icons/arrow_forward.svg"
          width={48}
          height={48}
          className="w-4 h-4 pointer-events-none select-none"
        />
      </Button>
    </div>
  );
}
