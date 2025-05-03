export interface ApplicationQuestion {
  id: string;
  order: number;
  text: string;
  type: string;
  validation?: any;
  options?: string[];
}

export enum APPLICATION_STATUS {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  WAITLISTED = "waitlisted",
  REJECTED = "rejected",
  ACCEPTED = "accepted"
}