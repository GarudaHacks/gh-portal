import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Page from "@/components/Page";
import { fetchMyMentorships } from "@/lib/http/mentorship";
import { MentorshipAppointmentResponseAsHacker } from "@/types/mentorship";
import MentorshipAppointmentCardComponent from "@/components/MentorshipAppointmentCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function MentorshipHistoryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pastMentorships, setPastMentorships] = useState<MentorshipAppointmentResponseAsHacker[]>([]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchMyMentorships(false, true)
      .then((res) => {
        if (isMounted) {
          setPastMentorships(res);
          setLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.error("Error fetching mentorship history:", error);
          setLoading(false);
          toast.error("Failed to load mentorship history");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Page
      title="Mentorship History"
      description="All of your past mentorship sessions."
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-start items-start gap-2 text-pretty">
          <Button variant="ghost" className="gap-2 -ml-3" onClick={() => navigate("/mentorship")}>
            <ArrowLeft size={16} /> Back to Mentorship
          </Button>
          <h2 className="font-bold text-2xl lg:text-3xl">Mentorship History</h2>
          <p>All of your past mentorship sessions.</p>
        </div>

        {loading ? (
          <div className="w-full min-h-screen flex flex-col items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : pastMentorships.length > 0 ? (
          <div className="flex flex-col gap-4">
            {pastMentorships.map((m) => (
              <MentorshipAppointmentCardComponent key={m.id} mentorshipAppointment={m} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">You do not have any past mentorship sessions.</p>
        )}
      </div>
    </Page>
  );
}
