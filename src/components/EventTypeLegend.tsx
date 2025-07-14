import { EventTypeLegendProps } from "../types/eventTypes";

function EventTypeLegend({
  eventTypes = [
    { type: "main", label: "Main Events", color: "#FF0068" },
    { type: "workshop", label: "Workshops", color: "#9f0041" },
    { type: "activity", label: "Activities", color: "#FF0068" },
    { type: "break", label: "Breaks", color: "#9f0041" },
  ],
}: EventTypeLegendProps): JSX.Element {
  return (
    <div className="flex flex-wrap gap-4">
      {eventTypes.map((eventType, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-4 h-4 mr-2 rounded-sm`}
            style={{ backgroundColor: eventType.color }}
          ></div>
          <span className="text-white">{eventType.label}</span>
        </div>
      ))}
    </div>
  );
}

export default EventTypeLegend;
