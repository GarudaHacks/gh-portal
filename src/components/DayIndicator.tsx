import { DayIndicatorProps } from "../types/eventTypes";

function DayIndicator({ currentDay, eventDays }: DayIndicatorProps) {
  return (
    <div className="font-medium text-lg relative h-10 flex items-center text-white">
      <div className="relative w-24 h-10">
        {eventDays.map((day, index) => (
          <div
            key={`day-${index}`}
            className="absolute inset-0 flex items-center transition-all duration-700 ease-in-out"
            style={{
              opacity: currentDay === day.name ? 1 : 0,
              transform:
                currentDay === day.name
                  ? "translateY(0)"
                  : currentDay === eventDays[index - 1]?.name
                  ? "translateY(10px)"
                  : "translateY(-10px)",
              zIndex: currentDay === day.name ? 2 : 1,
            }}
          >
            {day.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DayIndicator;
