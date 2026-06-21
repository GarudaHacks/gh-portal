import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import GarudieWelcome from "@/components/GarudieWelcome";
import garudieAccepted from "/assets/garudie-accepted.png"
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function ApplicationAccepted() {
  const navigate = useNavigate()
  const rsvpRef = useRef<HTMLDivElement>(null)
  const [isRsvpVisible, setIsRsvpVisible] = useState(true)

  useEffect(() => {
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!rsvpRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsRsvpVisible(entry.isIntersecting),
      { threshold: 0.5 }
    )
    observer.observe(rsvpRef.current)
    return () => observer.disconnect()
  }, [])

  const scrollToRsvp = () => {
    rsvpRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  return (
    <div className="flex flex-col gap-10 text-pretty p-4">
      <GarudieWelcome imageRightPosition={0} imageTopPosition={0} imageSizing="w-64" />
      <Separator />
      <div className="text-center flex flex-col gap-2 bg-[url('/assets/gh-6-0.png')] bg-cover bg-center rounded-xl overflow-hidden">
        <div className="backdrop-blur-sm bg-black/30 px-4 py-10">
          <div className="flex flex-col gap-4 items-center justify-center lg:max-w-xl mx-auto ">
            <div className="animate-fly">
              <img src={garudieAccepted} alt="Garudie Accepted" />
            </div>
            <p className="text-white font-bold">You've been chosen as one of the builders and innovators of Garuda Hacks 7.0. We can't wait to see what you'll build.</p>
          </div>
        </div>
      </div>
      <div ref={rsvpRef} className="text-center flex flex-col gap-2 p-4  bg-cover bg-center rounded-xl">
        <p className="text-xl font-semibold">Your spot is waiting — are you in?</p>
        <p>Hit confirm below to lock in your spot — we'll send a confirmation email to bring on the day of the event.</p>
        <div className="h-6" />
        <Button size={"lg"} className="animate-pulse-border w-full max-w-lg mx-auto">
          Confirm RSVP
        </Button>
      </div>
      {!isRsvpVisible && (
        <button
          onClick={scrollToRsvp}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg animate-bounce cursor-pointer"
        >
          Confirm RSVP
          <ChevronDown className="size-4" />
        </button>
      )}
    </div>
  )
}