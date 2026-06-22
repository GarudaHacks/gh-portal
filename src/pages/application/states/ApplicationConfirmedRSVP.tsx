import { useRef, useState } from "react"
import { toPng } from "html-to-image"
import BoardingPass from "@/components/BoardingPass"
import GarudieWelcome from "@/components/GarudieWelcome"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Download,
  Loader2,
  MessageCircle,
  CalendarCheck,
  Rocket,
  PartyPopper,
  Globe,
} from "lucide-react"

export default function ApplicationConfirmedRSVP() {
  const boardingPassRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

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
        {/* Boarding pass section */} 
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-bold text-center">
            See You at The Event Day!
          </h1>

          <BoardingPass
            ref={boardingPassRef}
            firstName="Hello"
            lastName="World"
            userId="asdf"
            dateOfBirth="16 April 2005"
            nationality="Indonesian"
            gender="Female"
            occupationPlace="DPV"
            email="hey@gmail.com"
            phone="1234567890"
            soloOrTeamOrSpeedDating="Solo"
          />

          <div className="flex justify-end">
            <Button
              variant="outline"
              size="icon"
              className="w-fit aspect-square"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Download />
              )}
            </Button>
          </div>
        </div>

        {/* Pre-flight checklist */}
        <div className="rounded-xl border border-border/60 p-5 flex flex-col gap-3 bg-white">
          <h2 className="font-semibold text-base flex items-center gap-2">
            <Rocket className="w-4 h-4 text-tertiary" />
            Mandatory Pre-flight Checklist
          </h2>
          <ul className="flex flex-col gap-2.5 text-sm text-foreground/80">
            <li className="flex items-start gap-2.5">
              <MessageCircle className="w-4 h-4 mt-0.5 text-accent shrink-0" />
              <span>
                Join our{" "}
                <Button variant="link" className="h-auto p-0 text-sm text-accent">
                  Discord server
                </Button>
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CalendarCheck className="w-4 h-4 mt-0.5 text-accent shrink-0" />
              <span>
                General Participant Briefing: <strong>Wednesday, July 8th, 2026</strong>{" "}
                [Online, Meeting Link TBA].
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <PartyPopper className="w-4 h-4 mt-0.5 text-accent shrink-0" />
              <span>Make sure you can attend 16–18 July 2026</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Globe className="w-4 h-4 mt-0.5 text-accent shrink-0" />
              <span>
                Follow{" "}
                <a
                  href="https://www.instagram.com/garudahacks/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline underline-offset-2"
                >
                  @garudahacks
                </a>{" "}
                for updates
              </span>
            </li>
          </ul>
        </div>

        {/* Event schedule */}
        <div className="rounded-xl border border-border/60 p-5 flex flex-col gap-3 bg-white">
          <h2 className="font-semibold text-base flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-tertiary" />
            Event Schedule
          </h2>
          <ul className="flex flex-col gap-2.5 text-sm text-foreground/80">
            <ScheduleItem
              date="Saturday, 11 July 2026"
              tag="Online"
              description="Online Speed Dating"
            />
            <ScheduleItem
              date="Thursday, 16 July 2026"
              description="Opening Ceremony, Offline Speed Dating, Networking Lunch, Hacking Begins"
            />
            <ScheduleItem
              date="Friday, 17 July 2026"
              description="Tech & Talent Fair, Free Photobooth, Hacking Continues, Hacking ends at 8 PM"
            />
            <ScheduleItem
              date="Saturday, 18 July 2026"
              description="Live Pitching & Judging Session, Awarding Ceremony"
            />
          </ul>
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
