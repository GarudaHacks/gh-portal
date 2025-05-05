export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string | null;
  admin: boolean;
  created_at: string;
  date_of_birth: string | null;
  education: string | null;
  gender_identity: string | null;
  github: string | null;
  grade: number | null;
  linkedin: string | null;
  portfolio: string | null;
  school: string | null;
  status: string;
  year: number | null;
}
