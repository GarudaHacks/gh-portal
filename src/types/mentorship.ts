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

/**
 * Define appointment booked by hackers for a mentor. Related to collection `mentorships`.
 */
export interface MentorshipAppointment {
  id?: string;
  startTime: number;
  endTime: number;
  mentorId: string;
  hackerId?: string; // a hacker book for the whole team
  hackerDescription?: string; // desc given needed by hacker
  location: string;
}