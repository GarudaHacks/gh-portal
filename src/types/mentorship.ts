export interface MentorshipConfig {
    isMentorshipOpen: boolean;
    mentoringStart: number;
    mentoringEnd: number;
}

/**
 * Mentor type of user.
 */
export interface FirestoreMentor {
  id?: string;
  email: string;
  name: string;
  mentor: boolean;
  specialization: string;
  discordUsername: string;
  intro: string; // introduction given by mentor
}

export interface MentorshipAppointmentResponseAsHacker {
	id?: string;
  startTime: number;
  endTime: number;
  mentorId: string;
  mentorName?: string;
  mentorSpecialization?: string;
  mentorTitle?: string;
  hackerId?: string;
  hackerName?: string;
  teamName?: string;
  hackerDescription?: string; // desc given needed by hacker
  location: string; // offline or online
  offlineLocation?: string; // to be filled if the location is offline
  meetLink?: string; // Google Meet link, set when location is online
}

export interface MentorshipAppointmentResponseAsMentor {
	id?: string;
  startTime: number;
  endTime: number;
  mentorId: string;
  hackerId?: string;
  hackerName?: string;
  teamName?: string;
  hackerDescription?: string; // desc given needed by hacker
  location: string; // offline or online
  offlineLocation?: string; // to be filled if the location is offline
  mentorMarkAsDone?: boolean;
  mentorMarkAsAfk?: boolean; // mark if this team is AFK
  mentorNotes?: string // to give this appointment a note
}