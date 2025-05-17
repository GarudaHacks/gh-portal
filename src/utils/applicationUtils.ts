import { APPLICATION_STATES } from "@/pages/Application";

export const getStateKey = (value: string): keyof typeof APPLICATION_STATES => {
  return Object.keys(APPLICATION_STATES).find(
    (key) =>
      APPLICATION_STATES[key as keyof typeof APPLICATION_STATES] === value
  ) as keyof typeof APPLICATION_STATES;
};
