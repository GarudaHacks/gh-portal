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
  hackerId?: string;
  hackerName?: string;
  teamName?: string;
  hackerDescription?: string; // desc given needed by hacker
  location: string; // offline or online
  offlineLocation?: string; // to be filled if the location is offline
}