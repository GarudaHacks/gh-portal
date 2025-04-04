import { EventTypeLegendProps } from "../types/eventTypes";

function EventTypeLegend({
	eventTypes = [
		{ type: "main", label: "Main Events", color: "#3b82f6" },
		{ type: "workshop", label: "Workshops", color: "#ec4899" },
		{ type: "activity", label: "Activities", color: "#8b5cf6" },
		{ type: "break", label: "Breaks", color: "#22c55e" },
	],
}: EventTypeLegendProps): JSX.Element {
	return (
		<div className="flex flex-wrap gap-4">
			{eventTypes.map((eventType, index) => (
				<div
					key={index}
					className="flex items-center"
				>
					<div
						className={`w-4 h-4 mr-2 rounded-sm`}
						style={{ backgroundColor: eventType.color }}
					></div>
					<span>{eventType.label}</span>
				</div>
			))}
		</div>
	);
}

export default EventTypeLegend;
