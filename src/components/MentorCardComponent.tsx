import { FirestoreMentor, MentorshipConfig } from "@/types/mentorship"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { getMentorProfilePicture } from "@/utils/firebaseUtils"
import { Button } from "./ui/button"
import { formatSpecialization } from "@/utils/stringUtils"
import { Link } from "react-router-dom"

interface MentorCardComponentProps {
  mentor: FirestoreMentor,
  isMentorshipOpen?: boolean
}

export default function MentorCardComponent(
  { mentor, isMentorshipOpen }: MentorCardComponentProps
) {
  const [profilePictureUrl, setProfilePictureUrl] = useState('')

  useEffect(() => {
    getMentorProfilePicture(mentor.displayName).then((res) => setProfilePictureUrl(res))
  }, [mentor])

  return (
    <Card className="">
      <CardHeader className="text-center">
        <CardTitle className="flex flex-col gap-2 items-center">
          <img src={profilePictureUrl || '/images/logo/gh_logo.svg'} width={500} height={500} alt="profile picture" className="rounded-full w-2/3 md:w-3/5 aspect-square border" />
          <p className="text-xl">{mentor.displayName}</p>
          <p>{mentor.mentorTitle}</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-center text-sm line-clamp-4 text-pretty">{mentor.intro}</p>
        <Link to={`/mentors/${mentor.id}`}>
          <Button className="w-full">Book Mentor</Button>
        </Link>
      </CardContent>
    </Card>
  )
}