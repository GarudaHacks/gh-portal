import { useEffect, useRef, useState } from "react"
import { toPng } from "html-to-image"
import BoardingPass, { type BoardingPassData } from "@/components/BoardingPass"
import GarudieWelcome from "@/components/GarudieWelcome"
import { useAuth } from "@/context/AuthContext"
import { fetchMyBoardingPass } from "@/lib/http/user"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Download,
  Loader2,
  MessageCircle,
  CalendarCheck,
  Rocket,
  PartyPopper,
  Globe,
  ChevronsLeftRightEllipsis,
  Wifi,
  Info,
  Camera,
  Smartphone,
} from "lucide-react"
import { Link } from "react-router-dom"
import { eventName } from "@/config"
import ghAppVideo from "/assets/gh-app-web.mp4"
import ghAppPoster from "/assets/gh-app-poster.jpg"

export default function ApplicationConfirmedRSVP() {
  const { user } = useAuth()
  const boardingPassRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [boardingPass, setBoardingPass] = useState<BoardingPassData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyBoardingPass()
      .then((data) => setBoardingPass(data ?? null))
      .finally(() => setLoading(false))
  }, [])

  async function handleDownload() {
    const el = boardingPassRef.current
    if (!el) return
    setDownloading(true)

    const prev = {
      width: el.style.width,
      maxWidth: el.style.maxWidth,
      overflow: el.style.overflow,
    }

    try {
      el.style.width = "390px"
      el.style.maxWidth = "390px"
      el.style.overflow = "visible"

      const dataUrl = await toPng(el, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: "#f9f5ff",
        style: { margin: "0", padding: "0" },
      })
      const link = document.createElement("a")
      link.download = "garuda-hacks-7.0-boarding-pass.png"
      link.href = dataUrl
      link.click()
    } catch {
      // silent fail — user can retry
    } finally {
      el.style.width = prev.width
      el.style.maxWidth = prev.maxWidth
      el.style.overflow = prev.overflow
      setDownloading(false)
    }
  }



  return (
    <div className="flex flex-col gap-10 text-pretty p-4">
      <GarudieWelcome />
      <Separator />

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-center">
            See You at The Event Day!
          </h1>
          <div className="text-center text-xs">
            <p>Please save the pass below and keep it around for re-registration on the event day. </p>
            <p>Pay attention to the <a href="#checklist" className="underline text-tertiary">mandatory pre-flight checklist</a> as well.</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5 lg:items-start">
          {/* Boarding pass section — main actor */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin w-8 h-8 text-tertiary" />
              </div>
            ) : boardingPass ? (
              <>
                <BoardingPass
                  ref={boardingPassRef}
                  userId={user?.uid ?? ""}
                  {...boardingPass}
                />
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    className="w-fit"
                    onClick={handleDownload}
                    disabled={downloading}
                  >
                    {downloading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>Save Pass <Download /></>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-center text-muted text-sm">
                Unable to load your boarding pass. Please try refreshing the page.
              </p>
            )}
          </div>

          <div id="checklist" className="rounded-xl border-2 border-accent/40 p-5 flex flex-col gap-3 bg-accent/5 lg:col-span-2 lg:sticky lg:top-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <Rocket className="w-4 h-4 text-tertiary" />
                Pre-flight Checklist
              </h2>
            </div>
            <p className="text-xs text-foreground/60 -mt-1">
              Don't skip these — mandatory before the event.
            </p>
            <ul className="flex flex-col gap-2.5 text-sm text-foreground/80">
              <li className="flex items-start gap-2.5">
                <CalendarCheck className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                <span>
                  General Participant Briefing: <strong>Wednesday, July 8th, 2026 at 8 PM WIB</strong> through{" "}
                  <Button asChild variant="link" className="h-auto p-0 text-sm text-accent">
                    <Link to={"https://purdue-edu.zoom.us/j/5813052601?omn=96479315070"} target="_blank" rel="noopener noreferrer">
                      Zoom
                    </Link>
                  </Button>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                <span>
                  Join our{" "}
                  <Button asChild variant="link" className="h-auto p-0 text-sm text-accent">
                    <Link to={"https://discord.gg/6Qu6vp6v3u"} target="_blank" rel="noopener noreferrer">
                      official Discord server
                    </Link>
                  </Button>
                  {" "}for important announcements or to get to know other hackers
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Smartphone className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                <span>
                  Download the official {eventName} App for{" "}
                  <Button asChild variant="link" className="h-auto p-0 text-sm text-accent">
                    <Link to={"https://apps.apple.com/id/app/garuda-hacks-7-0/id6504819018"} target="_blank" rel="noopener noreferrer">
                      iOS
                    </Link>
                  </Button>
                  {" "}or{" "}
                  <Button asChild variant="link" className="h-auto p-0 text-sm text-accent">
                    <Link to={"https://play.google.com/store/apps/details?id=com.garudahacks.app.garuda_hacks"} target="_blank" rel="noopener noreferrer">
                      Android
                    </Link>
                  </Button>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Wifi className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                <span>
                  Register your device's MAC address{" "}
                  <Button asChild variant="link" className="h-auto p-0 text-sm text-accent">
                    <Link to={"https://forms.gle/W15y3cR1VydtDSh66"} target="_blank" rel="noopener noreferrer">
                      here
                    </Link>
                  </Button>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Camera className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                <span>
                  Let your friends know you're joining using our{" "}
                  <Button asChild variant="link" className="h-auto p-0 text-sm text-accent">
                    <Link to={"https://docs.google.com/document/d/1uH8KeqLuI8dNjxqUTIPlou2HX8c22pIh2NHPydlld7g/edit?usp=sharing"} target="_blank" rel="noopener noreferrer">
                      Twibbon
                    </Link>
                  </Button>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Info className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                <span>
                  Check your email inbox regularly for the rest of pre-flight checklist
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Globe className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                <span>
                  Follow Instagram{" "}
                  <a
                    href="https://www.instagram.com/garudahacks/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline underline-offset-2"
                  >
                    @garudahacks
                  </a>{" "}for the latest updates
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <PartyPopper className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                <span>Mark your calendar for July 16-18th, 2026!</span>
              </li>
            </ul>

            <Separator />

            <div id="gh-app" className="rounded-xl border-2 border-accent/40 p-5 flex flex-col gap-3 bg-tertiary/10 lg:col-span-2 lg:sticky lg:top-4">
              <p className="text-sm font-semibold">Introducing {eventName} Mobile App!</p>
              <video
                className="w-full h-auto rounded-lg border border-accent/20 bg-black"
                controls
                preload="none"
                playsInline
                poster={ghAppPoster}
              >
                <source src={ghAppVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>

        {/* Help */}
        <p className="text-sm text-muted text-center">
          Need help? Contact{" "}
          <a
            href="mailto:ben@garudahacks.com"
            className="text-accent underline underline-offset-2"
          >
            ben@garudahacks.com
          </a>{" "}
          or DM{" "}
          <a
            href="https://www.instagram.com/garudahacks/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2"
          >
            @garudahacks
          </a>
        </p>
      </div>
    </div>
  )
}

function ScheduleItem({
  date,
  tag,
  description,
}: {
  date: string
  tag?: string
  description: string
}) {
  return (
    <li className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold text-foreground/60 flex items-center gap-1.5">
        {date}
        {tag && (
          <span className="text-[10px] font-mono text-accent/80 bg-accent/10 px-1.5 py-0.5 rounded-full">
            {tag}
          </span>
        )}
      </span>
      <span>{description}</span>
    </li>
  )
}
