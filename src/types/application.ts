export interface ApplicationQuestion {
  id: string;
  text: string;
  type: string;
  options?: string[];
}

export enum APPLICATION_STATUS {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  WAITLISTED = "waitlisted",
  REJECTED = "rejected",
  ACCPETED = "accepted"
}