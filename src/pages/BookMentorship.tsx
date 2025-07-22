import MentorshipSlotAsHackerComponent from "@/components/MentorshipSlotAsHacker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { bookMentorshipAppointment, fetchMentorById, fetchMentorshipAppointmentsByMentorId } from "@/lib/http/mentorship";
import { FirestoreMentor, MentorshipAppointmentResponseAsHacker } from "@/types/mentorship";
import { getMentorProfilePicture } from "@/utils/firebaseUtils";
import { formatSpecialization } from "@/utils/stringUtils";
import { ChevronLeft, Loader2, Calendar, Clock, MapPin, User, CheckCircle2 } from "lucide-react";
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
  hackerDescription: z.string().min(1, "Description is required").max(1000, "Description must be 1000 characters or less"),
  offlineLocation: z.string().optional(),
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
  const [isBookingLoading, setIsBookingLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
      hackerDescription: "",
      offlineLocation: ""
    },
  })

  if (!mentorId) {
    return <Navigate to="/mentorship" />;
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
          const sortedSlots = slots.sort((a: MentorshipAppointmentResponseAsHacker, b: MentorshipAppointmentResponseAsHacker) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          );
          setMentor(mentorData);
          setProfilePictureUrl(pictureUrl);
          setMentorshipSlots(sortedSlots);
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
    setIsBookingLoading(true)
    try {
      const payload = {
        mentorships: selectedSlots.map((slot) => ({
          id: slot.id,
          hackerName: user?.displayName || "Anonymous Hacker",
          teamName: values.teamName,
          hackerDescription: values.hackerDescription,
          offlineLocation: values.offlineLocation,
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
    } finally {
      setIsBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin h-12 w-12" />
          <p className="text-gray-300">Loading mentorship details...</p>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-blue-950 p-4 flex flex-col gap-4">
        <Button variant="outline" onClick={() => navigate(-1)} className="w-fit bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div className="flex-1 flex items-center justify-center">
          <Card className=" border-gray-700">
            <CardContent className="p-8 text-center">
              <p className="text-gray-300 text-lg">Mentor not found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen ">
      {/* Header */}
      <div className="sticky top-0 p-4 backdrop-blur-sm border-b border-gray-800 z-10">
        <Button variant="outline" onClick={() => navigate(-1)} className="w-fit text-white ">
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Mentors
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left Panel - Mentor Profile */}
          <div className="lg:col-span-1">
            {/* Desktop View */}
            <Card className="lg:block hidden bg-gray-800/30 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="relative mx-auto w-32 h-32 mb-4">
                  <img
                    src={profilePictureUrl || "/images/logo/gh_logo.svg"}
                    alt="profile picture"
                    className="w-full h-full rounded-full object-cover border"
                  />
                </div>
                <CardTitle className="text-2xl text-white font-bold">{mentor.name}</CardTitle>
                {mentor.specialization && (
                  <CardDescription className=" font-medium text-lg">
                    {formatSpecialization(mentor.specialization)}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-4">
                  <div className="rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 " />
                      About
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{mentor.intro}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile View */}
            <div className="lg:hidden">
              <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={profilePictureUrl || "/images/logo/gh_logo.svg"}
                        alt="profile picture"
                        className="w-16 h-16 rounded-full object-cover border flex-shrink-0"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-bold text-white truncate">{mentor.name}</h2>
                      {mentor.specialization && (
                        <p className="text-sm font-medium mb-2">
                          {formatSpecialization(mentor.specialization)}
                        </p>
                      )}
                      <p className="text-xs text-gray-300 line-clamp-3">{mentor.intro}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Panel - Mentoring Slots */}
          <div className="lg:col-span-2 flex flex-col overflow-hidden pb-24 lg:pb-0">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 " />
              <h1 className="text-2xl font-bold text-white">
                Available Sessions
                <span className="ml-2 text-lg font-normal text-gray-400">
                  ({mentorshipSlots?.length || 0} slots)
                </span>
              </h1>
            </div>

            <div className="flex-1 overflow-y-auto">
              {mentorshipSlots === null ? (
                <div className="flex justify-center items-center h-64">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin h-8 w-8 " />
                    <p className="text-gray-300">Loading available slots...</p>
                  </div>
                </div>
              ) : mentorshipSlots.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <Card className="bg-gray-800/30 border-gray-700">
                    <CardContent className="p-8 text-center">
                      <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-300 text-lg mb-2">No slots available</p>
                      <p className="text-gray-500 text-sm">This mentor doesn't have any open time slots right now.</p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="grid gap-4 pb-4">
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

      {/* Bottom Fixed Panel - Booking Actions */}
      <div className="fixed bottom-0 left-0 right-0  backdrop-blur-sm border-t  p-4 lg:relative lg:bg-transparent lg:border-0">
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          {/* Selection Summary */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle2 className="w-4 h-4 " />
              <span>Selected <strong className="text-white">{selectedSlots.length}</strong> of <strong className="text-white">2</strong> slots</span>
            </div>
            {selectedSlots.length > 0 && (
              <div className="text-xs text-gray-500">
                ({selectedSlots.reduce((total, slot) => total + (slot.endTime - slot.startTime) / 60, 0)} minutes total)
              </div>
            )}
          </div>

          {selectedSlots.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              {selectedSlots.map((slot, index) => (
                <div key={slot.id} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-3 h-3 text-blue-400" />
                    <span className="text-white font-medium">
                      {epochToStringDate(slot.startTime)} - {epochToStringDate(slot.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <MapPin className="w-3 h-3" />
                    <span className="capitalize">{slot.location}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Book Button */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="flex flex-col items-center justify-center">
                <Button
                  className="w-full max-w-md text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 disabled:opacity-50"
                  size="lg"
                  disabled={selectedSlots.length === 0}
                >
                  {selectedSlots.length === 0 ? 'Select slots to continue' : `Book ${selectedSlots.length} Session${selectedSlots.length > 1 ? 's' : ''}`}
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">Complete Your Booking</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Fill in your team details to book the selected mentorship sessions
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="teamName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Team Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your team name"
                            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-primary"
                            {...field}
                          />
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
                        <FormLabel className="text-white">What do you need help with?</FormLabel>
                        <FormControl>
                          <Textarea
                            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 min-h-[100px]"
                            placeholder="Describe what you'd like to discuss or get help with during the mentorship session..."
                            maxLength={1000}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedSlots.some((slot) => slot.location === "offline") && (
                    <FormField
                      control={form.control}
                      name="offlineLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Offline Location</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter the offline location"
                              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="rounded-lg p-4">
                    <p className="text-sm text-gray-300 text-center">
                      Please honor your booking. Mentors may mark you as absent if you fail to attend the scheduled session.
                    </p>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        className="w-full py-3"
                        disabled={isBookingLoading}
                      >
                        {isBookingLoading ? (
                          <>
                            <Loader2 className="animate-spin w-4 h-4 mr-2" />
                            Processing...
                          </>
                        ) : (
                          'Review & Confirm Booking'
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-900 border-gray-700 text-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          Confirm Your Booking
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          Review your selected sessions before confirming
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <div className="space-y-3 my-4">
                        {selectedSlots.map((slot, index) => (
                          <div key={slot.id} className=" border border-gray-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 " />
                              <span className="font-medium">Session {index + 1}</span>
                            </div>
                            <div className="text-sm space-y-1">
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span>{epochToStringDate(slot.startTime)} - {epochToStringDate(slot.endTime)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                <span className="capitalize">{slot.location}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className=""
                          onClick={() => form.handleSubmit(onSubmit)()}
                          disabled={isBookingLoading}
                        >
                          {isBookingLoading ? (
                            <>
                              <Loader2 className="animate-spin w-4 h-4 mr-2" />
                              Booking...
                            </>
                          ) : (
                            'Confirm Booking'
                          )}
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