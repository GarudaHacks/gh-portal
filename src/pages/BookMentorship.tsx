import MentorshipSlotAsHackerComponent from "@/components/MentorshipSlotAsHacker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { bookMentorshipAppointment, fetchMentorById, fetchMentorshipAppointmentsByMentorId } from "@/lib/http/mentorship";
import { FirestoreMentor, MentorshipAppointmentResponseAsHacker } from "@/types/mentorship";
import { getMentorProfilePicture } from "@/utils/firebaseUtils";
import { formatSpecialization } from "@/utils/stringUtils";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { epochToStringDate } from "@/utils/dateUtils";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useAuth } from "@/context/AuthContext";

const formSchema = z.object({
  teamName: z.string().min(1, "Team name is required"),
  hackerDescription: z.string().min(1, "Description is required").max(1000, "Description must be 1000 characters or less")
})

export default function BookMentorshipPage() {
  const { user } = useAuth()
  const { mentorId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [mentor, setMentor] = useState<FirestoreMentor | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [mentorshipSlots, setMentorshipSlots] = useState<MentorshipAppointmentResponseAsHacker[] | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<MentorshipAppointmentResponseAsHacker[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
      hackerDescription: "",
    },
  })

  if (!mentorId) {
    return <Navigate to="/home" />;
  }

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      fetchMentorById(mentorId),
      fetchMentorById(mentorId).then((mentorData) => getMentorProfilePicture(mentorData.name)),
      fetchMentorshipAppointmentsByMentorId(mentorId),
    ])
      .then(([mentorData, pictureUrl, slots]) => {
        if (isMounted) {
          setMentor(mentorData);
          setProfilePictureUrl(pictureUrl);
          setMentorshipSlots(slots);
          setLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.error("Error fetching mentorship data:", error);
          setLoading(false);
          toast.error("Failed to load mentorship data");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [mentorId]);

  const handleSelectSlots = (slot: MentorshipAppointmentResponseAsHacker) => {
    setSelectedSlots((prev) => {
      if (prev.includes(slot)) {
        return prev.filter((s) => s.id !== slot.id);
      }
      if (prev.length >= 2) {
        toast.error("You can select a maximum of 2 slots.");
        return prev;
      }
      return [...prev, slot];
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = {
        mentorships: selectedSlots.map((slot) => ({
          id: slot.id,
          hackerName: user?.displayName || "Anonymous Hacker",
          teamName: values.teamName,
          hackerDescription: values.hackerDescription
        }))
      };
      const res = await bookMentorshipAppointment(payload);
      toast.success(res.message || "Mentorship slots booked successfully!");
      navigate("/mentorship");
    } catch (error: any) {
      console.error("Error booking mentorship:", error);
      if (error.message.includes("limit reached")) {
        toast.error("Booking limit reached. Please select fewer slots or try different slots.");
      } else {
        toast.error(error.message || "Failed to book mentorship slots");
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="p-4 flex flex-col gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ChevronLeft /> Back
        </Button>
        <p className="text-center">Mentor not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="sticky top-0 p-4 bg-background z-10">
        <Button variant="outline" onClick={() => navigate(-1)} className="w-fit">
          <ChevronLeft /> Back
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          <div className="lg:col-span-1">
            <Card id="desktop-card" className="lg:block hidden bg-blue-950/50 transition-all">
              <CardHeader className="text-center">
                <CardTitle className="flex flex-col gap-2 items-center">
                  <img
                    src={profilePictureUrl || "/images/logo/gh_logo.svg"}
                    width={500}
                    height={500}
                    alt="profile picture"
                    className="rounded-full w-2/3 md:w-3/5 aspect-square border"
                  />
                  <p className="text-xl">{mentor.name}</p>
                </CardTitle>
                {mentor.specialization && (
                  <CardDescription className="text-gray-400">
                    {formatSpecialization(mentor.specialization)}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-center text-sm text-pretty">{mentor.intro}</p>
              </CardContent>
            </Card>

            <div className="lg:hidden">
              <Card className="bg-blue-950/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={profilePictureUrl || "/images/logo/gh_logo.svg"}
                      width={80}
                      height={80}
                      alt="profile picture"
                      className="rounded-full w-20 h-20 border flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-bold text-white truncate">{mentor.name}</h2>
                      {mentor.specialization && (
                        <p className="text-sm text-gray-400 mb-2">
                          {formatSpecialization(mentor.specialization)}
                        </p>
                      )}
                      <p className="text-xs text-gray-300 line-clamp-4">{mentor.intro}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col overflow-hidden pb-20 lg:pb-0">
            <h1 className="text-2xl font-bold mb-4 text-white">Mentoring Schedules ({mentorshipSlots?.length})</h1>
            <div className="flex-1 overflow-y-auto">
              {mentorshipSlots === null ? (
                <div className="flex justify-center">
                  <Loader2 className="animate-spin h-6 w-6" />
                </div>
              ) : mentorshipSlots.length === 0 ? (
                <p className="text-center">No mentoring slots available.</p>
              ) : (
                <div className="grid gap-4">
                  {mentorshipSlots.map((slot) => (
                    <MentorshipSlotAsHackerComponent
                      key={slot.id}
                      mentorshipAppointment={slot}
                      selectedSlots={selectedSlots}
                      onClick={() => handleSelectSlots(slot)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 lg:relative">
        <div className="flex flex-col gap-4">
          <p className="text-center">Selected {selectedSlots.length} of 2 mentorship slots</p>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full" disabled={selectedSlots.length === 0}>Book</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="text-white">
                <DialogTitle>Booking Details</DialogTitle>
                <DialogDescription>
                  This booking will be made under your name for your team
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="teamName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Team Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Team name" className="text-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hackerDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Inquiry</FormLabel>
                        <FormControl>
                          <Textarea className="text-white" placeholder="I need help with..." maxLength={1000} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p className="text-sm text-gray-50 text-center text-pretty">
                    Please honor the booking you made. The mentor may mark you as AFK if you fail to attend the session.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild className="w-full">
                      <Button type="button">Book Now</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="text-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Booking</AlertDialogTitle>
                        <AlertDialogDescription>
                          You will book these slots
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <div className="flex flex-col gap-4">
                        {selectedSlots.map((slot) => (
                          <div key={slot.id} className="p-4 border rounded-lg text-center">
                            <p>{epochToStringDate(slot.startTime)} - {epochToStringDate(slot.endTime)}</p>
                          </div>
                        ))}
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction type="submit" onClick={() => form.handleSubmit(onSubmit)()}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}