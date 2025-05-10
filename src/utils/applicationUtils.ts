import { APPLICATION_STATES } from "@/pages/Application";

export const getStateKey = (value: string): keyof typeof APPLICATION_STATES => {
    return Object.keys(APPLICATION_STATES).find(key =>
        APPLICATION_STATES[key as keyof typeof APPLICATION_STATES] === value
    ) as keyof typeof APPLICATION_STATES;
};

// Add this function to map frontend state to JSON category
export function mapStateToCategory(state: APPLICATION_STATES): string | null {
  switch (state) {
    case APPLICATION_STATES.PROFILE:
      return "PROFILE";
    case APPLICATION_STATES.INQUIRY:
      return "APPLICATION"; // Maps to APPLICATION category in JSON
    case APPLICATION_STATES.ADDITIONAL_QUESTION:
      return "INQUIRY"; // Maps to INQUIRY category in JSON
    default:
      return null; // For INTRO, SUBMITTED, etc.
  }
}