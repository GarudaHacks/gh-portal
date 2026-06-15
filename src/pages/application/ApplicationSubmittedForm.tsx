import { Button } from "../../components/ui/button";
import garudieCelebrate from "/assets/garudie-celebrate.png";

export default function ApplicationSubmittedForm() {
  const handleClickHome = () => {
    window.location.replace("/home"); // force refresh full page
  }

  return (
    <div className="p-4 flex flex-col items-center justify-center gap-4 lg:gap-6 w-full">
      <div>
        <div className="flex flex-col items-center w-full">
          <img
            src={garudieCelebrate}
            width={300}
            height={300}
            className="w-52 lg:w-64 pointer-events-none select-none"
          />
        </div>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Hooray! Thanks for applying.
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Your application has been submitted successfully. We will review applications and release decisions on a rolling basis.
          <br /><br />
          Stay tuned for any emails from us — we'll reach out with updates as soon as we can. In the meantime, follow us on Instagram <a href="https://www.instagram.com/garudahacks/" className="underline">@garudahacks</a> for the latest news, or visit <a href="https://garudahacks.com" className="underline">garudahacks.com</a>.
        </p>
      </div>
      <Button
        className="w-full lg:w-fit place-self-end font-semibold"
        size="lg"
        onClick={handleClickHome}
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
