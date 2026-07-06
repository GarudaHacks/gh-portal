import { Button } from "./ui/button"
import { BookOpen, ExternalLink } from "lucide-react"
import { Link } from "react-router-dom"

export default function InstructionMentorshipForHacker() {
  return (
    <div className="p-4 flex flex-col gap-4 lg:flex-row bg-white border border-tertiary rounded-xl items-center">
      <div className="flex flex-row w-full gap-2 items-center">
        <div className="p-2 bg-tertiary text-white rounded-xl w-fit aspect-square">
          <BookOpen size={24} />
        </div>
        <div>
          <p className="font-bold">Mentorship Guide</p>
          <p className="text-muted-foreground text-sm">Check out our mentorship guide to learn how it works.</p>
        </div>
      </div>
      <Link className="w-full lg:w-fit" target="_blank" rel="noopener noreferrer" to={`https://docs.google.com/document/d/1y0ct6AU4kHHNpkNEPp0B-6wagTM-xWcFV8NE9nzZTOs/edit?usp=sharing`}>
        <Button variant={"outline"} className="w-full">
          Read Mentorship Guide <ExternalLink />
        </Button>
      </Link>
    </div>
  )
}