import { forwardRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Timestamp } from "firebase/firestore"
import { formatISOToFriendly } from "@/utils/dateUtils"

export interface BoardingPassData {
  firstName: string
  lastName: string
  teamFormation: string
  teamName?: string
  dateOfBirth?: string
  nationality?: string
  gender?: string
  affiliation?: string
  email?: string
  phone?: string
  acceptedAt?: string
  confirmedRsvpAt?: string
  /**
   * HMAC signature of `${userId}/${firstName}/${lastName}/${confirmedRsvpAt}`,
   * computed server-side and returned with the boarding-pass data. Appended to
   * the QR so the admin scanner can verify the code was issued by us.
   */
  qrSignature?: string
}

interface BoardingPassProps extends BoardingPassData {
  userId: string
}

const BoardingPass = forwardRef<HTMLDivElement, BoardingPassProps>(
  function BoardingPass(
    {
      userId,
      firstName,
      lastName,
      dateOfBirth,
      nationality,
      gender,
      affiliation,
      email,
      phone,
      teamFormation,
      teamName,
      acceptedAt,
      confirmedRsvpAt,
      qrSignature,
    },
    ref
  ) {
    const message = `${userId}/${firstName}/${lastName}/${confirmedRsvpAt}`
    const qrValue = qrSignature ? `${message}/${qrSignature}` : message

    return (
      <div ref={ref} className="w-full max-w-md mx-auto">
        <div className="relative flex flex-col rounded-2xl shadow-[0_0_30px_rgba(135,79,254,0.25)] border border-white/10">
          {/* ── Top: main info ── */}
          <div className="relative bg-linear-to-br from-[#221139] via-[#2d1850] to-[#1a0e2e] p-5 pb-4 rounded-t-2xl">
            {/* Grid overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(135,79,254,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(135,79,254,0.5) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Corner accent */}
            <div className="pointer-events-none absolute top-0 right-0 w-32 h-32 bg-tertiary/5 rounded-bl-full" />

            {/* Header */}
            <div className="relative flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2.5">
                <img
                  src="/images/logo/gh_logo.svg"
                  alt="Garuda Hacks"
                  className="h-8 w-8"
                />
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-tertiary">
                    Garuda Hacks 7.0
                  </p>
                  <p className="text-[9px] tracking-wider text-white/40 uppercase">
                    Boarding Pass
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1 justify-end items-end">
                <span className="text-[10px] font-mono tracking-widest text-accent/80 bg-accent/10 px-2.5 py-1 rounded-full border border-accent/20 w-fit">
                  {teamFormation.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-white/80 w-32 line-clamp-5 text-end wrap-break-word">
                  {teamName}
                </span>
              </div>
            </div>

            {/* Hacker name */}
            <div className="relative mb-5">
              <p className="text-[9px] tracking-[0.15em] uppercase text-white/40 mb-1">
                Hacker
              </p>
              <h2 className="text-2xl font-bold tracking-wide text-white leading-tight">
                {lastName}
                <span className="text-tertiary"> / </span>
                {firstName}
              </h2>
            </div>

            {/* Info grid */}
            <div className="relative grid grid-cols-2 gap-x-4 gap-y-3">
              <Field label="Date of Birth" value={dateOfBirth} />
              <Field label="Nationality" value={nationality} />
              <Field label="Gender" value={gender} />
              <Field label="Affiliation" value={affiliation} mono={false} />
              <Field label="Email" value={email} />
              <Field label="Phone" value={phone} />
            </div>

            {/* Accent line */}
            <div className="relative mt-5 h-px bg-linear-to-r from-tertiary/60 via-accent/40 to-transparent" />
          </div>

          {/* ── Perforated divider ── */}
          <div className="relative h-6 shrink-0 bg-[#1e0f33]">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-background z-10" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-background z-10" />
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-px border-t border-dashed border-white/15" />
          </div>

          {/* ── Bottom: QR section ── */}
          <div className="relative flex items-center justify-between gap-4 bg-[#1a0e2e] px-5 py-4 rounded-b-2xl">
            <div className="flex flex-col gap-1">
              <p className="text-[9px] tracking-[0.15em] uppercase text-white/40">
                Check-In Code
              </p>
              <p className="text-[10px] font-mono text-white/50 break-all leading-relaxed">
                {userId}
              </p>
              {acceptedAt && <p className="text-[10px] font-mono text-white/50 break-all leading-relaxed">A-{formatISOToFriendly(acceptedAt)}</p>}
              {confirmedRsvpAt && <p className="text-[10px] font-mono text-white/50 break-all leading-relaxed">C-{formatISOToFriendly(confirmedRsvpAt)}</p>}
            </div>

            <div className="relative shrink-0">
              <div className="absolute -inset-4 rounded-full bg-tertiary/8 blur-xl" />
              <div className="relative rounded-lg bg-white p-2 shadow-[0_0_20px_rgba(135,79,254,0.15)]">
                <QRCodeSVG
                  value={qrValue}
                  size={72}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#221139"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

export default BoardingPass

function Field({
  label,
  value,
  mono = true,
}: {
  label: string
  value?: string
  mono?: boolean
}) {
  return (
    <div className="min-w-0">
      <p className="text-[8px] tracking-[0.15em] uppercase text-white/35 mb-0.5">
        {label}
      </p>
      <p
        className={`text-[11px] text-white/90 truncate ${mono ? "font-mono" : "font-sans"}`}
      >
        {value || "—"}
      </p>
    </div>
  )
}
