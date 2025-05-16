export interface ApplicationQuestion {
  id: string;
  order: number;
  text: string;
  type: string;
  validation?: any;
  required: boolean;
  options?: string[];
  category: string;
}

export enum APPLICATION_STATUS {
  NOT_APPLICABLE = "not applicable",
  DRAFT = "draft",
  SUBMITTED = "submitted",
  WAITLISTED = "waitlisted",
  REJECTED = "rejected",
  ACCEPTED = "accepted"
}