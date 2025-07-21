import { MentorshipAppointmentResponseAsHacker } from "@/types/mentorship";
import { epochToStringDate, isTimeElapsed } from "@/utils/dateUtils";
import { Badge } from "./ui/badge";
import { MapPinCheck, MonitorSmartphone } from "lucide-react";
import { Input } from "./ui/input";

interface MentorshipSlotAsHackerComponentProps {
  mentorshipAppointment: MentorshipAppointmentResponseAsHacker;
  selectedSlots: MentorshipAppointmentResponseAsHacker[];
  onClick: () => void;
}

export default function MentorshipSlotAsHackerComponent({
  mentorshipAppointment,
  selectedSlots,
  onClick,
}: MentorshipSlotAsHackerComponentProps) {
  const isSelected = selectedSlots.some((slot) => slot.id === mentorshipAppointment.id);
  const isDisabled = mentorshipAppointment.hackerId || isTimeElapsed(mentorshipAppointment.startTime);

  return (
    <div className={`border p-4 rounded-xl flex flex-row gap-2 justify-between items-center ${mentorshipAppointment.hackerId ? ' bg-zinc-500/40' : ' bg-zinc-500/10'}`}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center gap-2">
          {mentorshipAppointment.hackerId ? (
            <Badge variant="outline" className="bg-blue-950/50 text-gray-600">
              Booked
            </Badge>
          ) : (
            <>
              {!isTimeElapsed(mentorshipAppointment.startTime) ? (
                <Badge className="bg-green-500">Available</Badge>
              ) : (
                <Badge variant="outline">Time Elapsed</Badge>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-white">
            {epochToStringDate(mentorshipAppointment.startTime)} -{" "}
            {epochToStringDate(mentorshipAppointment.endTime)}
          </p>
          <p className="text-white">
            {(mentorshipAppointment.endTime - mentorshipAppointment.startTime) / 60} minutes
          </p>
          {!mentorshipAppointment.hackerId && <p className="text-white text-sm">Mentor is available <span className="font-bold">{mentorshipAppointment.location}</span></p>}
        </div>
      </div>
      <div>
        <Input
          type="checkbox"
          checked={isSelected}
          onClick={onClick}
          disabled={isDisabled ? true : false}
          className="w-5 h-5"
        />
      </div>
    </div>
  );
}