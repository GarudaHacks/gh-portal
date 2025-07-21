import { useEffect, useState } from "react";
import Page from "../components/Page";
import { FirestoreMentor, MentorshipAppointmentResponseAsHacker, MentorshipConfig } from "@/types/mentorship";
import { fetchAllMentors, fetchMentorshipConfig, fetchMyMentorships } from "@/lib/http/mentorship";
import MentorshipAppointmentCardComponent from "@/components/MentorshipAppointmentCard";
import MentorCardComponent from "@/components/MentorCardComponent";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";

function Mentorship() {
  const [loading, setLoading] = useState(false)
  const [mentorshipConfig, setMentorshipConfig] = useState<MentorshipConfig>()
  const [myMentorships, setMyMentorships] = useState<MentorshipAppointmentResponseAsHacker[]>()
  const [allMentors, setAllMentors] = useState<FirestoreMentor[]>([])
  const [filteredMentors, setFilteredMentors] =  useState<FirestoreMentor[]>([])
  const [filterCategories, setFilterCategories] = useState<string[]>([])

  const CATEGORIES = [
    "backend",
    "frontend",
    "developer",
    "designer",
    "data scientist",
    "product manager",
    "entrepreneur",
  ]

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      fetchMentorshipConfig(),
      fetchMyMentorships(),
      fetchAllMentors(),
    ])
      .then(([configRes, myMentorshipsRes, allMentorsRes]) => {
        if (isMounted) {
          setMentorshipConfig(configRes);
          setMyMentorships(myMentorshipsRes);
          setAllMentors(allMentorsRes);
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
    if (filterCategories.length === 0) {
      setFilteredMentors(allMentors);
    } else {
      setFilteredMentors(
        allMentors.filter((mentor) =>
          filterCategories.some((category) =>
            mentor.specialization?.toLowerCase().includes(category.toLowerCase())
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
      {loading ? (
        <div className="w-full min-h-screen flex flex-col items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div id="mentorship-period" className="bg-zinc-50/20 p-4 rounded-xl">
            {mentorshipConfig?.isMentorshipOpen ? (
              <h1 className="text-xl">✅ Mentorship is currently open</h1>
            ) : (
              <h1 className="text-xl">⚠️ Mentorship is currently closed</h1>
            )}
          </div>

          <div className="flex flex-col gap-8">
            <div id="upcoming-mentorships" className="flex flex-col gap-4">
              <h2 className="font-semibold text-xl">Mentorship Requests</h2>
              {myMentorships && myMentorships.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {myMentorships.map((m) => (
                    <MentorshipAppointmentCardComponent key={m.id} mentorshipAppointment={m} />
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground">You are currently do not have any mentorships request.</p>
                </div>
              )}
            </div>

            <div id="mentors-list" className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="font-semibold text-xl">Garuda Hacks 6.0 Mentors</h2>

               <div id="mentorship-categories" className="w-full max-w-full overflow-x-auto overflow-y-hidden pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scroll-smooth mb-4">
                  <div className="flex flex-nowrap gap-2 min-w-max">
                    {CATEGORIES.map((category,i) => (
                      <Badge 
                        className="text-white whitespace-nowrap flex-shrink-0 cursor-pointer" 
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                    {filteredMentors.map((m) => (
                      <MentorCardComponent key={m.id} mentor={m} />
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="text-muted-foreground">
                      {filterCategories.length > 0
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

    </Page>
  );
}

export default Mentorship;
