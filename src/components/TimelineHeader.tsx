import { TimelineHeaderProps } from "../types/eventTypes";

function TimelineHeader({ hourMarkers, hourWidth }: TimelineHeaderProps) {
  return (
    <div className="flex border-b border-gray-200 sticky top-0 bg-white z-10 w-full">
      {hourMarkers.map((marker, index) => (
        <div
          key={index}
          className="p-2 text-left text-sm font-medium text-gray-700"
          style={{
            width: `${hourWidth}px`,
            minWidth: `${hourWidth}px`,
          }}
        >
          {marker.text}
        </div>
      ))}
    </div>
  );
}

export default TimelineHeader;
