import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../components/Page";
import { FirestoreMentor, MentorshipAppointmentResponseAsHacker, MentorshipConfig } from "@/types/mentorship";
import { fetchAllMentors, fetchMentorshipConfig, fetchMyMentorships } from "@/lib/http/mentorship";
import MentorshipAppointmentCardComponent from "@/components/MentorshipAppointmentCard";
import MentorCardComponent from "@/components/MentorCardComponent";
import { Calendar, History, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { eventName } from "@/config";
import { Button } from "@/components/ui/button";
import InstructionMentorshipForHacker from "@/components/InstructionMentorshipForHacker";

const CATEGORIES = [
  "backend",
  "frontend",
  "developer",
  "designer",
  "data scientist",
  "product manager",
  "entrepreneur",
  "others",
]

function Mentorship() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [mentorshipConfig, setMentorshipConfig] = useState<MentorshipConfig>()
  const [myMentorships, setMyMentorships] = useState<MentorshipAppointmentResponseAsHacker[]>()
  const [allMentors, setAllMentors] = useState<FirestoreMentor[]>([])
  const [filteredMentors, setFilteredMentors] = useState<FirestoreMentor[]>([])
  const [filterCategories, setFilterCategories] = useState<string[]>(CATEGORIES)

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      fetchMyMentorships(true, false),
      fetchAllMentors(),
      fetchMentorshipConfig(),
    ])
      .then(([myMentorshipsRes, allMentorsRes, mentorshipConfig]) => {
        if (isMounted) {
          setMyMentorships(myMentorshipsRes);
          setAllMentors(allMentorsRes);
          setMentorshipConfig(mentorshipConfig)
          setLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.error('Error fetching data:', error);
          setLoading(false);
          toast.error("Failed to load data", error)
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (filterCategories.length === CATEGORIES.length) {
      setFilteredMentors(allMentors);
    } else {
      const namedCategories = CATEGORIES.filter((c) => c !== "others");
      const matchesNamedCategory = (mentor: FirestoreMentor) =>
        namedCategories.some((category) =>
          mentor.specialization?.toLowerCase().includes(category.toLowerCase())
        );

      setFilteredMentors(
        allMentors.filter((mentor) =>
          filterCategories.some((category) =>
            category === "others"
              ? !matchesNamedCategory(mentor)
              : mentor.specialization?.toLowerCase().includes(category.toLowerCase())
          )
        )
      );
    }
  }, [filterCategories, allMentors]);

  const handleSelectCategory = (category: string) => {
    setFilterCategories((prev: any) => {
      if (prev.includes(category)) {
        return prev.filter((c: string) => c !== category);
      }
      return [...prev, category];
    });
  };

  return (
    <Page
      title="Mentorship"
      description="Submit a request or question to a mentor for help on your project."
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-start items-start gap-2 text-pretty">
          <h2 className="font-bold text-2xl lg:text-3xl">Mentorship</h2>
          <p>Submit a request or question to a mentor for help on your project.</p>
        </div>
        <InstructionMentorshipForHacker />
        <div className="h-6"></div>
        <div className="flex justify-end">
          <Button variant={"secondary"} onClick={() => navigate("/mentorship/history")}><History />History</Button>
        </div>
        {loading ? (
          <div className="w-full min-h-screen flex flex-col items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-8">
              <div id="upcoming-mentorships" className="flex flex-col gap-4 bg-white p-4 border-tertiary border rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="bg-tertiary/25 text-tertiary p-2 rounded-xl w-fit">
                    <Calendar />
                  </div>
                  <div className="flex flex-col items-start">
                    <h2 className="font-semibold text-xl">My Mentorship Requests</h2>
                    <p className="text-sm text-muted-foreground">Upcoming mentorship sessions</p>
                  </div>
                </div>
                {myMentorships && myMentorships.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {myMentorships.map((m) => (
                      <MentorshipAppointmentCardComponent key={m.id} mentorshipAppointment={m} needInstructions />
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="text-muted-foreground">You are currently do not have any mentorships request.</p>
                  </div>
                )}
              </div>

              <div id="mentors-list" className="flex flex-col gap-4 mt-8">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col">
                    <h2 className="font-semibold text-xl">{eventName} Mentors</h2>
                    <p>Look for mentors and book a session that fits your needs.</p>
                  </div>

                  <div id="mentorship-categories" className="w-full max-w-full overflow-x-auto overflow-y-hidden pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scroll-smooth mb-4">
                    <div className="flex flex-nowrap gap-2 min-w-max">
                      {CATEGORIES.map((category, i) => (
                        <Badge
                          className="whitespace-nowrap flex-shrink-0 cursor-pointer"
                          variant={filterCategories?.includes(category) ? 'default' : 'outline'}
                          key={i}
                          onClick={() => handleSelectCategory(category)}
                        >
                          {category.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>


                  {filteredMentors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredMentors.map((m) => (
                        <MentorCardComponent key={m.id} mentor={m} isMentorshipOpen={mentorshipConfig?.isMentorshipOpen || false} />
                      ))}
                    </div>
                  ) : (
                    <div>
                      <p className="text-muted-foreground">
                        {filterCategories.length === 0
                          ? "No categories selected."
                          : filterCategories.length < CATEGORIES.length
                          ? "No mentors match the selected categories."
                          : "No mentors available."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}

export default Mentorship;
