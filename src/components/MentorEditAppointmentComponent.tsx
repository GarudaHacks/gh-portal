import { Label } from "@radix-ui/react-label";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { mentorUpdateMyMentorship } from "@/lib/http/mentorship";
import toast from "react-hot-toast";
import { MentorshipAppointmentResponseAsMentor } from "@/types/mentorship";

export default function MentorEditAppointmentComponent({ mentorshipAppointment }: { mentorshipAppointment: MentorshipAppointmentResponseAsMentor }) {
  const [mentorNotes, setMentorNotes] = useState(mentorshipAppointment.mentorNotes || "");
  const [mentorMarkAsDone, setMentorMarkAsDone] = useState(mentorshipAppointment.mentorMarkAsDone || false);
  const [mentorMarkAsAfk, setMentorMarkAsAfk] = useState(mentorshipAppointment.mentorMarkAsAfk || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnSaveChange = async () => {
    try {
      setIsLoading(true);
      const payload = {
        mentorNotes,
        mentorMarkAsDone,
        mentorMarkAsAfk,
      };
      const response = await mentorUpdateMyMentorship(mentorshipAppointment.id || '', payload);
      toast.success("Changes saved successfully!");
      window.location.reload()
      return response;
    } catch (err) {
      const error = err as Error;
      console.error(`Error when trying to save mentorship appointment: ${error}`);
      toast.error(error.message || "Failed to save changes");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2>Comments</h2>
        <Textarea
          className="h-40"
          value={mentorNotes}
          onChange={(e) => setMentorNotes(e.target.value)}
          placeholder="Add your notes here..."
        />
        <p className="text-sm text-muted-foreground">
          Use this box to add comments or notes, such as recommendations, mentorship notes, or reminders about the inquiry. These notes are private and can be edited before or after the scheduled appointment.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Switch
            id="afk-mode"
            checked={mentorMarkAsAfk}
            onCheckedChange={(checked) => setMentorMarkAsAfk(checked)}
          />
          <Label htmlFor="afk-mode">Mark as AFK</Label>
        </div>
        <p className="text-sm text-muted-foreground">
          Mark this team as AFK if they do not respond or reach out to you after the scheduled appointment begins. This will prevent them from booking additional mentorship sessions with you or other mentors.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Switch
            id="done-mode"
            checked={mentorMarkAsDone}
            onCheckedChange={(checked) => setMentorMarkAsDone(checked)}
          />
          <Label htmlFor="done-mode">Mark as Done</Label>
        </div>
        <p className="text-sm text-muted-foreground">
          Check this box once you have completed the mentoring session.
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleOnSaveChange}
          disabled={isLoading}
          className="flex flex-row items-center gap-2"
        >
          Save Changes
          {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}