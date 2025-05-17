/**
 * EventItem interface defines the structure of an event in the schedule
 */
export interface EventItem {
  id: number;
  title: string;
  startTime: Date;
  endTime: Date;
  location: string;
  description: string;
  type: "main" | "workshop" | "activity" | "break";
}

/**
 * TimeSlot interface defines the structure of a time slot containing events
 */
export interface TimeSlot {
  startTime: Date;
  events: EventItem[];
  rows: EventItem[][];
}

/**
 * Position interface defines the position and dimensions of an event on the timeline
 */
export interface Position {
  left: number;
  width: number;
}

/**
 * StyleSet interface defines the styling options for different event types
 */
export interface StyleSet {
  bg: string;
  border: string;
  indicator: string;
}

/**
 * HourMarker interface defines the structure of hour markers on the timeline
 */
export interface HourMarker {
  text: string;
  isSecondDay: boolean;
}

/**
 * Props for the EventCard component
 */
export interface EventCardProps {
  event: EventItem;
  isExpanded: boolean;
  position?: Position;
  rowIndex?: number;
  isDesktop: boolean;
  eventHeight: number;
  eventGap: number;
  onEventClick: (event: EventItem, e: React.MouseEvent) => void;
  setRef: (id: number, element: HTMLDivElement | null) => void;
  renderEventDetails: (event: EventItem) => JSX.Element;
}

/**
 * Props for the TimelineHeader component
 */
export interface TimelineHeaderProps {
  hourMarkers: HourMarker[];
  hourWidth: number;
}

interface EventType {
  type: string;
  label: string;
  color: string;
}
/**
 * Props for the EventTypeLegend component
 */
export interface EventTypeLegendProps {
  eventTypes: EventType[];
}

/**
 * Props for the DayIndicator component
 */
export interface DayIndicatorProps {
  currentDay: string;
  eventDays: { date: Date; name: string }[];
}
