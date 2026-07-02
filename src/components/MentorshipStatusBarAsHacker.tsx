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
    <div id="mentorship-period" className="bg-zinc-50/20 rounded-xl flex flex-col gap-2">
      {mentorshipConfig?.isMentorshipOpen ? (
        <></>
      ) : (
        <div className="bg-tertiary text-white px-3 py-1 rounded-xl">
          ⚠️ Mentorship is currently closed
        </div>
      )}
      <InstructionMentorshipForHacker />
    </div>
  )
}