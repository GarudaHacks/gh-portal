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
import { useEffect, useState } from "react"
import { getMentorProfilePicture } from "@/utils/firebaseUtils"

interface MentorCardComponentProps {
  mentor: FirestoreMentor,
}

export default function MentorCardComponent(
  { mentor }: MentorCardComponentProps
) {
  const [profilePictureUrl, setProfilePictureUrl] = useState('')

  useEffect(() => {
    getMentorProfilePicture(mentor.name).then((res) => setProfilePictureUrl(res))
  }, [mentor])

  return (
    <Link to={`/mentorship/${mentor.id}`} className="w-full">
      <Card className="hover:bg-zinc-200/10 bg-blue-950/50 transition-all h-full">
        <CardHeader className="text-center">
          <CardTitle className="flex flex-col gap-2 items-center">
            <img src={profilePictureUrl || '/images/logo/gh_logo.svg'} width={500} height={500} alt="profile picture" className="rounded-full w-2/3 md:w-3/5 aspect-square border" />
            <p className="text-xl">{mentor.name}</p>
          </CardTitle>
          {mentor.specialization && <CardDescription className="text-gray-400">{mentor.specialization.toUpperCase()}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm line-clamp-4 text-pretty">{mentor.intro}</p>
        </CardContent>
      </Card>
    </Link>
  )
}