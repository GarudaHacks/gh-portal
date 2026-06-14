import { Separator } from "./ui/separator"

export default function ContactSupport() {
  return (
    <div className="p-4 flex flex-col gap-4 items-center justify-center my-10 text-xs w-full text-muted">
      <Separator />
      <p>Having trouble with the registration?</p>
      <p>Email your inquiry to <a href="mailto:heryan@garudahacks.com" className="underline">heryan@garudahacks.com</a></p>
    </div>
  )
}