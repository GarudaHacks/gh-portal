import { useEffect, useState } from "react";
import InstructionMentorshipForHacker from "./InstructionMentorshipForHacker";
import { MentorshipConfig } from "@/types/mentorship";
import { fetchMentorshipConfig } from "@/lib/http/mentorship";

export default function MentorshipStatusBarAsHacker() {
  const [mentorshipConfig, setMentorshipConfig] = useState<MentorshipConfig | null>(null);

  useEffect(() => {
    fetchMentorshipConfig().then((config) => {
      setMentorshipConfig(config)
    })
  }, [])

  return (
    <div id="mentorship-period" className="bg-zinc-50/20 p-4 rounded-xl flex flex-col gap-2">
      {mentorshipConfig?.isMentorshipOpen ? (
        <h1 className="text-xl lg:text-2xl">✅ Mentorship is currently open</h1>
      ) : (
        <div>
          <h1 className="text-xl lg:text-2xl">⚠️ Mentorship is currently closed</h1>
          <h2 className="text-sm">Mentorship will be available from July 24th at 2 PM to July 25th at 8 PM. You can start booking mentors one hour prior.</h2>
        </div>
      )}
      <InstructionMentorshipForHacker />
    </div>
  )
}