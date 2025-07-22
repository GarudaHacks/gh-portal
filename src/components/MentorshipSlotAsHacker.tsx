import { MentorshipAppointmentResponseAsHacker } from "@/types/mentorship";
import { epochToStringDate, isTimeElapsed } from "@/utils/dateUtils";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Clock, MapPin, Monitor, User, CheckCircle2 } from "lucide-react";

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
  const isBooked = !!mentorshipAppointment.hackerId;
  const isTimeElapsedCheck = isTimeElapsed(mentorshipAppointment.startTime);
  const duration = (mentorshipAppointment.endTime - mentorshipAppointment.startTime) / 60;
  
  // Format time range
  const startTime = epochToStringDate(mentorshipAppointment.startTime);
  const endTime = epochToStringDate(mentorshipAppointment.endTime);
  
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
      badge: <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">Available</Badge>,
      text: "Ready to book"
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div 
      className={`
        relative overflow-hidden border rounded-2xl transition-all duration-200 cursor-pointer
        ${isSelected ? 'ring-2 ring-blue-400 border-blue-500 shadow-lg shadow-blue-500/20' : 'border-gray-700 hover:border-gray-600 hover:shadow-md'}
        ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}
        ${isBooked ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gray-800/50 hover:bg-gray-800/70'}
      `}
      onClick={!isDisabled ? onClick : undefined}
    >

      
      <div className="p-6">
        {/* Header with status */}
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            {statusInfo.badge}
            <p className="text-sm text-gray-400">{statusInfo.text}</p>
          </div>
        </div>

        {/* Time information */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3 text-gray-900">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-semibold text-lg text-white">{startTime} - {endTime}</p>
              <p className="text-sm text-gray-400">{duration} minutes session</p>
            </div>
          </div>

          {/* Location information */}
          <div className="flex items-center gap-3 text-gray-300">
            {mentorshipAppointment.location.toLowerCase() === 'online' ? (
              <Monitor className="w-5 h-5 text-gray-400" />
            ) : (
              <MapPin className="w-5 h-5 text-gray-500" />
            )}
            <div>
              <p className="font-medium capitalize text-white">{mentorshipAppointment.location}</p>
              {mentorshipAppointment.offlineLocation && (
                <p className="text-sm text-gray-400">{mentorshipAppointment.offlineLocation}</p>
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
            onChange={() => {}} // Controlled by onClick
            className="w-5 h-5 rounded border-2 border-gray-500 text-blue-400 focus:ring-blue-500 bg-gray-800"
            tabIndex={-1}
          />
        </div>
      )}
    </div>
  );
}