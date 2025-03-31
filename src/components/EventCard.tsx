import { EventCardProps } from "../types/eventTypes";
import { formatTime, getEventTypeStyles } from "../utils/eventUtils";

function EventCard({
	event,
	isExpanded,
	position,
	rowIndex = 0,
	isDesktop,
	eventHeight,
	eventGap,
	onEventClick,
	setRef,
	renderEventDetails,
}: EventCardProps) {
	const typeStyles = getEventTypeStyles(event.type);

	// Desktop specific styles
	const desktopStyles = position
		? {
				position: "absolute" as const,
				left: `${position.left}px`,
				top: `${rowIndex * (eventHeight + eventGap)}px`,
				width: `${position.width}px`,
				height: isExpanded ? "auto" : `${eventHeight}px`,
				zIndex: isExpanded ? 10 : 1,
		  }
		: {};

	// Mobile specific styles
	const mobileStyles = !isDesktop
		? {
				minHeight: `${eventHeight}px`,
		  }
		: {};

	return (
		<div
			ref={(el) => setRef(event.id, el)}
			className={`p-3 rounded-md shadow-sm ${!isDesktop ? "mx-2" : ""} ${
				typeStyles.bg
			} ${typeStyles.border} cursor-pointer hover:shadow-md`}
			style={{
				...desktopStyles,
				...mobileStyles,
				overflow: "hidden",
				willChange: "height, transform, box-shadow",
				transition:
					"height 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
				transform: isExpanded ? "scale(1.02)" : "scale(1)",
				boxShadow: isExpanded ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "",
			}}
			onClick={(e) => onEventClick(event, e)}
		>
			<div className="font-medium">{event.title}</div>
			<div className="text-sm text-gray-600">
				{formatTime(event.startTime)} - {formatTime(event.endTime)}
			</div>
			{event.location && (
				<div className="text-sm text-gray-600">{event.location}</div>
			)}

			{!isDesktop && !isExpanded && (
				<div className="text-xs mt-1 text-gray-500 transition-opacity duration-200">
					Click for details
				</div>
			)}

			<div
				className="overflow-hidden transition-all duration-200 ease-in-out"
				style={{
					maxHeight: isExpanded ? "200px" : "0px",
					opacity: isExpanded ? 1 : 0,
					transform: "translateZ(0)",
				}}
			>
				{isExpanded && renderEventDetails(event)}
			</div>
		</div>
	);
}

export default EventCard;
