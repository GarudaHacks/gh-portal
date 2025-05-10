export enum APPLICATION_STATUS {
  NOT_STARTED = "not started",
  IN_PROGRESS = "in progress",
  SUBMITTED = "submitted",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export interface ValidationRules {
  maxLength?: number;
  pattern?: string;
  earliest?: string;
  latest?: string;
  accept?: string[];
  maxSizeMB?: number;
  min?: number;
  max?: number;
  step?: number;
  minSelections?: number;
  maxSelections?: number;
  maxWords?: number;
}

export interface ApplicationQuestion {
  id: string;
  text: string;
  category: string;
  type: string;
  order: number;
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRules;
  options?: string[];
  multiple?: boolean;
}
