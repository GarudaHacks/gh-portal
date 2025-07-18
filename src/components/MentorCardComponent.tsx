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

interface MentorCardComponentProps {
  mentor: FirestoreMentor
}

export default function MentorCardComponent(
  { mentor }: MentorCardComponentProps
) {
  return (
    <Card className="bg-transparent">
      <CardHeader className="text-center">
        <CardTitle className="flex flex-col gap-2 items-center">
          <img src="https://imgs.xkcd.com/comics/online_communities_small.png" width={400} height={400} alt="profile picture" className="rounded-full w-20 aspect-square" />
          {mentor.name}
        </CardTitle>
        {mentor.specialization && <CardDescription>{mentor.specialization.toUpperCase()}</CardDescription>}
      </CardHeader>
      <CardContent>
        <p className="text-center text-sm">{mentor.intro}</p>
      </CardContent>
    </Card>
  )
}