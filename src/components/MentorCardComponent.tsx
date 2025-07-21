import { FirestoreMentor } from "@/types/mentorship"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link } from "react-router-dom"

interface MentorCardComponentProps {
  mentor: FirestoreMentor
}

export default function MentorCardComponent(
  { mentor }: MentorCardComponentProps
) {
  return (
    <Link to={`/mentorship/${mentor.id}`} className="w-full">
      <Card className="bg-transparent hover:bg-zinc-200/10 transition-all h-full">
        <CardHeader className="text-center">
          <CardTitle className="flex flex-col gap-2 items-center">
            <img src="https://imgs.xkcd.com/comics/online_communities_small.png" width={400} height={400} alt="profile picture" className="rounded-full w-20 aspect-square" />
            {mentor.name}
          </CardTitle>
          {mentor.specialization && <CardDescription>{mentor.specialization.toUpperCase()}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm line-clamp-4">{mentor.intro}</p>
        </CardContent>
      </Card>
    </Link>
  )
}