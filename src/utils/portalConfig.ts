import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

export interface PortalConfig {
  applicationCloseDate: Date;
  applicationReleaseDate: Date;
  applicationStartDate: Date;
  applicationsOpen: boolean;
  hackathonEndDate: Date;
  hackathonStartDate: Date;
}

export interface PortalConfigStrings {
  applicationCloseDate: string;
  applicationReleaseDate: string;
  applicationStartDate: string;
  applicationsOpen: boolean;
  hackathonEndDate: string;
  hackathonStartDate: string;
}

let cachedConfig: PortalConfig | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; 

/**
 * Fetches portal configuration from Firestore
 */
export async function fetchPortalConfig(): Promise<PortalConfig> {
  const now = Date.now();
  if (cachedConfig && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedConfig;
  }

  try {
    const configDoc = await getDoc(doc(db, "config", "portalConfig"));
    
    if (!configDoc.exists()) {
      throw new Error("Portal config document not found");
    }

    const data = configDoc.data();
    
    const config: PortalConfig = {
      applicationCloseDate: data.applicationCloseDate?.toDate(),
      applicationReleaseDate: data.applicationReleaseDate?.toDate(),
      applicationStartDate: data.applicationStartDate?.toDate(),
      applicationsOpen: data.applicationsOpen || false,
      hackathonEndDate: data.hackathonEndDate?.toDate(),
      hackathonStartDate: data.hackathonStartDate?.toDate(),
    };
    cachedConfig = config;
    cacheTimestamp = now;

    return config;
  } catch (error) {
    const fallbackConfig: PortalConfig = {
      applicationCloseDate: new Date("2025-06-20"),
      applicationReleaseDate: new Date("2025-06-21"),
      applicationStartDate: new Date("2025-05-03"),
      applicationsOpen: false,
      hackathonEndDate: new Date("2025-07-26"),
      hackathonStartDate: new Date("2025-07-24"),
    };

    return fallbackConfig;
  }
}
/**
 * Clears the cached portal config (useful for testing or manual refresh)
 */
export function clearPortalConfigCache(): void {
  cachedConfig = null;
  cacheTimestamp = 0;
}

export const MENTORSHIP_ZOOM_LINK = "https://ntu-sg.zoom.us/j/84287494210?pwd=7xHMzD8jBvAqUYJ1gbD6jZOhtVnUe9.1";