import { EventItem, Position, StyleSet, TimeSlot } from "../types/eventTypes";

/**
 * Determine if two events overlap in time
 */
export const doEventsOverlap = (
  event1: EventItem,
  event2: EventItem
): boolean => {
  return (
    (event1.startTime < event2.endTime && event1.endTime > event2.startTime) ||
    (event2.startTime < event1.endTime && event2.endTime > event1.startTime)
  );
};

/**
 * Calculate position for timeline display
 */
export const calculateEventPosition = (
  event: EventItem,
  hackathonStartDate: Date,
  HOUR_WIDTH: number
): Position => {
  const minuteWidth = HOUR_WIDTH / 60;

  // Calculate minutes from hackathon start
  const eventStartTime = event.startTime.getTime();
  const hackathonStartTime = hackathonStartDate.getTime();

  const minutesFromStart = (eventStartTime - hackathonStartTime) / (1000 * 60);
  const eventDurationMinutes =
    (event.endTime.getTime() - event.startTime.getTime()) / (1000 * 60);

  return {
    left: minutesFromStart * minuteWidth,
    width: Math.max(eventDurationMinutes * minuteWidth, 150),
  };
};

/**
 * Get styling for different event types
 */
export const getEventTypeStyles = (type: string): StyleSet => {
  const styles: Record<string, StyleSet> = {
    main: {
      bg: "bg-blue-50",
      border: "border-l-4 border-blue-500",
      indicator: "bg-blue-500",
    },
    workshop: {
      bg: "bg-pink-50",
      border: "border-l-4 border-pink-500",
      indicator: "bg-pink-500",
    },
    activity: {
      bg: "bg-purple-50",
      border: "border-l-4 border-purple-500",
      indicator: "bg-purple-500",
    },
    break: {
      bg: "bg-green-50",
      border: "border-l-4 border-green-500",
      indicator: "bg-green-500",
    },
  };

  return styles[type] || styles.main;
};

/**
 * Format date to display time in a readable format
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Group events into time slots for better organization
 */
export const organizeEventsIntoTimeSlots = (
  allEvents: EventItem[]
): TimeSlot[] => {
  const timeSlots: Record<string, TimeSlot> = {};

  // Sort events by start time
  const sortedEvents = [...allEvents].sort(
    (a, b) => a.startTime.getTime() - b.startTime.getTime()
  );

  // Group overlapping events
  sortedEvents.forEach((event) => {
    let placed = false;

    // Check if this event belongs to any existing time slot
    Object.keys(timeSlots).forEach((slotKey) => {
      const slot = timeSlots[slotKey];
      // Check if this event overlaps with any event in this slot
      const overlapsWithSlot = slot.events.some((existingEvent) =>
        doEventsOverlap(event, existingEvent)
      );

      if (overlapsWithSlot) {
        slot.events.push(event);
        placed = true;
      }
    });

    // If it doesn't belong to any existing slot, create a new one
    if (!placed) {
      const slotKey = `slot-${event.startTime.getTime()}`;
      timeSlots[slotKey] = {
        startTime: new Date(event.startTime),
        events: [event],
        rows: [],
      };
    }
  });

  // For each timeslot, create rows of non-overlapping events
  Object.values(timeSlots).forEach((slot) => {
    const rows: EventItem[][] = [];

    slot.events.forEach((event) => {
      // Find a row where this event doesn't overlap
      let rowIndex = rows.findIndex(
        (row) =>
          !row.some((existingEvent) => doEventsOverlap(event, existingEvent))
      );

      // If no suitable row, create a new one
      if (rowIndex === -1) {
        rows.push([event]);
      } else {
        rows[rowIndex].push(event);
      }
    });

    // Sort events in each row by start time
    rows.forEach((row) => {
      row.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    });

    slot.rows = rows;
  });

  // Convert timeslots object to array and sort by start time
  return Object.values(timeSlots).sort(
    (a, b) => a.startTime.getTime() - b.startTime.getTime()
  );
};
