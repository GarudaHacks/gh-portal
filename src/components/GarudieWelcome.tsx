import { useAuth } from "@/context/AuthContext"

interface GarudieWelcomeProps {
  image?: string
  imageRightPosition: number
  imageTopPosition: number
  imageSizing: string
}

export default function GarudieWelcome({ image, imageRightPosition, imageTopPosition, imageSizing }: GarudieWelcomeProps) {
  const { user } = useAuth()
  return (
    <div className="flex justify-between items-center">
      <div className="flex-1 flex flex-col gap-4">
        {image && <div className={`absolute right-${imageRightPosition} top-${imageTopPosition} lg:relative`}>
          <img src={image} width={300} height={300} className="w-24 block lg:hidden mb-6 lg:mb-0" />
        </div>}
        <div className="flex flex-col justify-start items-start gap-2">
          <h2 className="font-bold text-2xl lg:text-3xl">Hello {user?.displayName}! 👋</h2>
          <p>Welcome to Garuda Hacks Portal! <br /> You can view all announcements, events, and everything you need to know here.</p>
        </div>
      </div>
      {image && <img src={image} width={300} height={300} className={`${imageSizing} hidden lg:block`} />}
    </div>
  )
}