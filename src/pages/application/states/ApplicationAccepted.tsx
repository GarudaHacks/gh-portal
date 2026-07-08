import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import GarudieWelcome from "@/components/GarudieWelcome";
import garudieAccepted from "/assets/garudie-accepted.png"
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, ChevronDown, Loader2 } from "lucide-react";

export default function ApplicationAccepted() {
  const rsvpRef = useRef<HTMLDivElement>(null)
  const [isRsvpVisible, setIsRsvpVisible] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  async function handleConfirmRsvp() {
    setSubmitting(true)
    try {
      const response = await fetch("/api/application/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-xsrf-token": Cookies.get("XSRF-TOKEN") || "",
        },
        credentials: "include",
        body: JSON.stringify({ rsvp: true }),
      })
      if (!response.ok) {
        throw new Error("Failed to confirm RSVP. Please log out and log back in to refresh your session.")
      }
      toast.success("RSVP Confirmed!")
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message || "Failed to confirm RSVP.")
    } finally {
      setSubmitting(false)
    }
  }

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
      <div className="text-center flex flex-col gap-2 bg-[url('/assets/gh-6-0.png')] bg-cover bg-center rounded-xl overflow-hidden shadow-lg">
        <div className="backdrop-blur-sm bg-black/30 px-4 py-10">
          <div className="flex flex-col gap-4 items-center justify-center lg:max-w-xl mx-auto ">
            <div className="animate-fly">
              <img src={garudieAccepted} alt="Garudie Accepted" />
            </div>
            <p className="text-white font-bold lg:text-xl">You've been chosen as one of the builders and innovators of Garuda Hacks 7.0. We can't wait to see what you'll build.</p>
          </div>
        </div>
      </div>
      <div ref={rsvpRef} className="text-center flex flex-col gap-2 p-4  bg-cover bg-center rounded-xl">
        <p className="text-2xl font-semibold mb-4">Your spot is waiting — are you in?</p>
        <p className="text-pretty max-w-2xl mx-auto">Hit confirm below to lock in your spot by 14th of July 23.59 PM WIB. Please note that we unfortunately won't be able to hold spots that aren't confirmed <b>by July 13th</b>.</p>
        <div className="h-6" />
        <Button size={"lg"} className="animate-pulse-border w-full max-w-lg mx-auto" onClick={handleConfirmRsvp} disabled={submitting}>
          {submitting ? <>Confirming...<Loader2 className="animate-spin mr-2" /></> : <>Confirm RSVP<CheckCircleIcon /></>}
        </Button>
      </div>
      {!isRsvpVisible && (
        <button
          onClick={submitting ? handleConfirmRsvp : scrollToRsvp}
          disabled={submitting}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg animate-bounce cursor-pointer"
        >
          Confirm RSVP
          <ChevronDown className="size-4" />
        </button>
      )}
    </div>
  )
}