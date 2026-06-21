import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { X } from "lucide-react";
import { useLocation } from "react-router-dom";

const HIDDEN_PATHS = ["/auth", "/terms", "/privacy"];
const LS_KEY = "dismissedAnnouncement";

export function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [announcementTitle, setAnnouncementTitle] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    getDoc(doc(db, "config", "portalConfig")).then((snap) => {
      if (!snap.exists()) return;
      const value = snap.data()?.liveAnnouncement;
      const valueTitle = snap.data()?.liveAnnouncementTitle;
      if (value && typeof value === "string" && value.trim() !== "") {
        setAnnouncement(value.trim());
        setAnnouncementTitle(valueTitle.trim());
      }
    });
  }, []);

  const isDismissed = announcement !== null &&
    localStorage.getItem(LS_KEY) === announcement;

  function dismiss() {
    if (announcement) localStorage.setItem(LS_KEY, announcement);
    setAnnouncement(null);
    setAnnouncementTitle(null);
  }

  if (
    isDismissed ||
    !announcement ||
    HIDDEN_PATHS.includes(location.pathname)
  ) {
    return null;
  }

  return (
    <div className="relative w-full bg-amber-200 text-amber-950 px-4 py-2.5 flex items-center justify-center gap-3 shrink-0 z-10">
      <div className="text-sm leading-snug text-center">
        <span className="font-semibold">{announcementTitle}</span> <span className="">{announcement}</span>
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-amber-500/50 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}
