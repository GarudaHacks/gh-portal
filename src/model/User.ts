import { UserApplicationStatus } from "@/types/applicationStatus";

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  admin?: boolean;
  created_at?: string | null;
  date_of_birth?: string | null;
  education_level?: string | null;
  university?: string | null;
  major?: string | null;
  graduation_year?: number | null;
  resume_url?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  phone_number?: string | null;
  applicationStatus?: UserApplicationStatus;
}
