import { MentorshipAppointmentResponseAsHacker } from "@/types/mentorship";
import { epochToStringDate, isTimeElapsed } from "@/utils/dateUtils";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Clock, MapPin, Monitor, User } from "lucide-react";

interface MentorshipSlotAsHackerComponentProps {
  mentorshipAppointment: MentorshipAppointmentResponseAsHacker;
  selectedSlots: MentorshipAppointmentResponseAsHacker[];
  onClick: () => void;
}

export default function AvailableMentorshipSlotAsHackerComponent({
  mentorshipAppointment,
  selectedSlots,
  onClick,
}: MentorshipSlotAsHackerComponentProps) {
  const isSelected = selectedSlots.some((slot) => slot.id === mentorshipAppointment.id);
  const isDisabled = mentorshipAppointment.hackerId || isTimeElapsed(mentorshipAppointment.startTime);
  const isBooked = !!mentorshipAppointment.hackerId;
  const isTimeElapsedCheck = isTimeElapsed(mentorshipAppointment.startTime);
  const duration = (mentorshipAppointment.endTime - mentorshipAppointment.startTime) / 60;

  // Format time range
  const startTime = epochToStringDate(mentorshipAppointment.startTime);

  // Get status info
  const getStatusInfo = () => {
    if (isBooked) {
      return {
        badge: <Badge variant="secondary" className="bg-blue-900/50 text-blue-200 border-blue-700">Booked</Badge>,
        text: "This slot is already taken"
      };
    }
    if (isTimeElapsedCheck) {
      return {
        badge: <Badge variant="outline" className="bg-gray-800 text-gray-400 border-gray-600">Time Elapsed</Badge>,
        text: "This time slot has passed"
      };
    }
    return {
      badge: <></>,
      text: "Ready to book"
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div
      className={`
        relative overflow-hidden border rounded-2xl transition-all duration-200 cursor-pointer
        ${isSelected ? 'bg-tertiary/20 border-tertiary' : 'hover:bg-tertiary/15'}
        ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}
        ${isBooked ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white border border-tertiary'}
      `}
      onClick={!isDisabled ? onClick : undefined}
    >
      <div className="p-4">
        {/* Header with status */}
        {/* <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            {statusInfo.badge}
            <p className="text-sm text-gray-400">{statusInfo.text}</p>
          </div>
        </div> */}

        {/* Time information */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3 text-gray-900">
            <div className="p-2 rounded-xl bg-tertiary">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-lg">{startTime}</p>
              <p className="text-sm text-gray-400">{duration} minutes</p>
            </div>
          </div>

          {/* Location information */}
          <div className="flex items-center gap-3 text-gray-300">
            {mentorshipAppointment.location.toLowerCase() === 'online' ? (
              <div className="p-2 rounded-xl bg-tertiary">
                <Monitor className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-tertiary">
                <MapPin className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <p className="font-medium capitalize text-tertiary">{mentorshipAppointment.location}</p>
              {mentorshipAppointment.offlineLocation && (
                <p className="text-sm">{mentorshipAppointment.offlineLocation}</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional info for booked slots */}
        {isBooked && mentorshipAppointment.hackerName && (
          <div className="border-t border-gray-700 pt-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <User className="w-4 h-4" />
              <span>Booked by {mentorshipAppointment.hackerName}</span>
              {mentorshipAppointment.teamName && (
                <span className="text-gray-500">({mentorshipAppointment.teamName})</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selection checkbox */}
      {!isDisabled && (
        <div className="absolute bottom-4 right-4">
          <Input
            type="checkbox"
            checked={isSelected}
            onChange={() => { }} // Controlled by onClick
            className="w-5 h-5 rounded border-2 border-gray-500 text-blue-400 focus:ring-blue-500 bg-gray-800"
            tabIndex={-1}
          />
        </div>
      )}
    </div>
  );
}