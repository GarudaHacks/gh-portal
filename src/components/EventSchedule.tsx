import { useState, useEffect, useMemo, useRef } from "react";
import { EventItem, HourMarker } from "../types/eventTypes";
import {
	calculateEventPosition,
	formatTime,
	organizeEventsIntoTimeSlots,
} from "../utils/eventUtils";
import EventCard from "./EventCard";
import TimelineHeader from "./TimelineHeader";
import DayIndicator from "./DayIndicator";
import EventTypeLegend from "./EventTypeLegend";
import { sampleEvents } from "../data/sampleEvents";

/**
 * EventSchedule component displays a responsive schedule for a hackathon
 */
const EventSchedule = () => {
	// Constants for layout dimensions
	const HOUR_WIDTH = 250; // Width for each hour in pixels
	const EVENT_GAP = 8; // Gap between events in the same time slot
	const EVENT_HEIGHT = 80; // Height of each event card

	// State for tracking window size for responsiveness
	const [windowWidth, setWindowWidth] = useState<number>(
		typeof window !== "undefined" ? window.innerWidth : 1024
	);

	// State for date selection and event display
	const hackathonStartDate = new Date("2025-03-01T08:00:00");
	const hackathonEndDate = new Date("2025-03-02T22:00:00");
	const totalHours = Math.ceil(
		(hackathonEndDate.getTime() - hackathonStartDate.getTime()) /
			(1000 * 60 * 60)
	);

	const eventDays = useMemo(() => {
		const days = [];
		const startDay = new Date(hackathonStartDate);
		const endDay = new Date(hackathonEndDate);

		for (
			let day = new Date(startDay);
			day <= endDay;
			day.setDate(day.getDate() + 1)
		) {
			days.push({
				date: new Date(day),
				name: day.toLocaleDateString("en-US", { weekday: "long" }),
			});
		}
		return days;
	}, [hackathonStartDate, hackathonEndDate]);

	const [currentDay, setCurrentDay] = useState<string>(eventDays[0].name);
	const [expandedEventId, setExpandedEventId] = useState<number | null>(null);
	const [scrollPosition, setScrollPosition] = useState<number>(0);
	const [dayChangeThreshold, setDayChangeThreshold] = useState<number>(0);

	const popupRef = useRef<HTMLDivElement | null>(null);
	const eventCardRefs = useRef<Record<number, HTMLDivElement | null>>({});
	const timelineRef = useRef<HTMLDivElement | null>(null);

	const isMobile = windowWidth <= 768;

	const allEvents = sampleEvents;

	const organizedTimeSlots = useMemo(
		() => organizeEventsIntoTimeSlots(allEvents),
		[allEvents]
	);

	/**
	 * Track window resizing for responsive behavior
	 */
	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	/**
	 * Handle click outside to close expanded event details
	 */
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (expandedEventId === null) return;

			const isOutsidePopup =
				!popupRef.current ||
				!(popupRef.current as HTMLElement).contains(event.target as Node);

			const isOnEventCard = Object.values(eventCardRefs.current).some(
				(ref) => ref && (ref as HTMLElement).contains(event.target as Node)
			);

			if (isOutsidePopup && !isOnEventCard) {
				setExpandedEventId(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [expandedEventId]);

	/**
	 * Determine the time range to display for the schedule
	 */
	const determineTimeRange = (): { start: number; totalHours: number } => {
		const startHour = 8;
		return { start: startHour, totalHours: totalHours };
	};
	const { totalHours: totalHackathonHours } = determineTimeRange();

	/**
	 * Generate hour markers for the timeline
	 */
	const generateHourMarkers = (): HourMarker[] => {
		const markers: HourMarker[] = [];
		const startDate = new Date(hackathonStartDate);

		for (let hour = 0; hour <= totalHackathonHours; hour++) {
			const currentHourDate = new Date(startDate);
			currentHourDate.setHours(startDate.getHours() + hour);

			const displayHour =
				currentHourDate.getHours() % 12 === 0
					? 12
					: currentHourDate.getHours() % 12;
			const period = currentHourDate.getHours() < 12 ? "AM" : "PM";
			const isSecondDay =
				currentHourDate.getDate() > hackathonStartDate.getDate();

			markers.push({
				text: `${displayHour}:00 ${period}`,
				isSecondDay: isSecondDay,
			});
		}
		return markers;
	};

	const hourMarkers = generateHourMarkers();
	const totalWidth = hourMarkers.length * HOUR_WIDTH;

	/**
	 * Calculate the day change threshold based on total width
	 */
	useEffect(() => {
		if (!isMobile && timelineRef.current) {
			setDayChangeThreshold(totalWidth / 2);
		}
	}, [totalWidth, isMobile]);

	/**
	 * Handle event click to show details
	 */
	const handleEventClick = (event: EventItem, e: React.MouseEvent): void => {
		e.stopPropagation();
		setExpandedEventId((prevId) => (prevId === event.id ? null : event.id));
	};

	/**
	 * Handle scroll events to update day indicator
	 */
	const handleScroll = (e: React.UIEvent<HTMLDivElement>): void => {
		const scrollLeft = (e.target as HTMLDivElement).scrollLeft;
		setScrollPosition(scrollLeft);

		// Calculate which day we're viewing based on scroll position
		// First day starts at 8 AM, so we need to account for that offset
		const firstDayStartHour = hackathonStartDate.getHours(); // 8 AM
		const hoursPerDay = 24;

		// Calculate day boundaries in pixels, accounting for first day
		const dayBoundaries = eventDays.map((day, index) => {
			if (index === 0) return 0;

			const dayStartTime = new Date(day.date);
			const hoursSinceStart =
				index === 1
					? hoursPerDay - firstDayStartHour
					: hoursPerDay - firstDayStartHour + (index - 1) * hoursPerDay;

			return hoursSinceStart * HOUR_WIDTH;
		});

		// Find which day boundary we've crossed
		let currentDayIndex = 0;
		for (let i = 1; i < dayBoundaries.length; i++) {
			if (scrollLeft >= dayBoundaries[i]) {
				currentDayIndex = i;
			}
		}
		const transitionBuffer = HOUR_WIDTH / 2;
		if (
			currentDayIndex < eventDays.length - 1 &&
			scrollLeft > dayBoundaries[currentDayIndex + 1] - transitionBuffer &&
			currentDay !== eventDays[currentDayIndex + 1].name
		) {
			setCurrentDay(eventDays[currentDayIndex + 1].name);
		} else if (
			currentDayIndex > 0 &&
			scrollLeft <= dayBoundaries[currentDayIndex] + transitionBuffer &&
			currentDay !== eventDays[currentDayIndex].name
		) {
			setCurrentDay(eventDays[currentDayIndex].name);
		} else if (currentDay !== eventDays[currentDayIndex].name) {
			setCurrentDay(eventDays[currentDayIndex].name);
		}
	};

	/**
	 * Memoize event details to avoid recalculation
	 */
	const renderEventDetails = useMemo(() => {
		const cache: Record<number, JSX.Element> = {};

		return (event: EventItem): JSX.Element => {
			if (cache[event.id]) return cache[event.id];

			const details = (
				<div className="mt-2 text-sm space-y-2">
					{event.location && (
						<div>
							<span className="font-medium">Location:</span> {event.location}
						</div>
					)}
					{event.description && (
						<div>
							<span className="font-medium">Description:</span>{" "}
							{event.description}
						</div>
					)}
				</div>
			);
			cache[event.id] = details;
			return details;
		};
	}, []);

	// Helper function to set event card refs
	const setEventCardRef = (id: number, element: HTMLDivElement | null) => {
		eventCardRefs.current[id] = element;
	};

	/**
	 * Render desktop schedule
	 */
	const renderDesktopSchedule = (): JSX.Element => {
		return (
			<div
				className="relative"
				style={{ width: `${totalWidth}px` }}
			>
				{organizedTimeSlots.map((timeSlot, timeSlotIndex) => (
					<div
						key={`timeslot-${timeSlotIndex}`}
						className="relative"
					>
						{timeSlot.rows.map((row, rowIndex) => (
							<div
								key={`row-${timeSlotIndex}-${rowIndex}`}
								className="flex flex-col gap-2"
							>
								{row.map((event) => {
									const position = calculateEventPosition(
										event,
										hackathonStartDate,
										HOUR_WIDTH
									);
									const isExpanded = expandedEventId === event.id;

									return (
										<EventCard
											key={event.id}
											event={event}
											isExpanded={isExpanded}
											position={position}
											rowIndex={rowIndex}
											isDesktop={true}
											eventHeight={EVENT_HEIGHT}
											eventGap={EVENT_GAP}
											onEventClick={handleEventClick}
											setRef={setEventCardRef}
											renderEventDetails={renderEventDetails}
										/>
									);
								})}
							</div>
						))}
					</div>
				))}
			</div>
		);
	};

	/**
	 * Render mobile schedule
	 */
	const renderMobileSchedule = (): JSX.Element => {
		return (
			<div
				className="flex flex-col gap-6 pb-6"
				style={{ width: "100%" }}
			>
				{organizedTimeSlots.map((timeSlot, timeSlotIndex) => (
					<div
						key={`mobile-timeslot-${timeSlotIndex}`}
						className="flex flex-col gap-2"
					>
						<div className="font-semibold text-gray-700 pl-2">
							{formatTime(timeSlot.startTime)}
						</div>

						{timeSlot.rows.flat().map((event) => {
							const isExpanded = expandedEventId === event.id;

							return (
								<EventCard
									key={event.id}
									event={event}
									isExpanded={isExpanded}
									isDesktop={false}
									eventHeight={EVENT_HEIGHT}
									eventGap={EVENT_GAP}
									onEventClick={handleEventClick}
									setRef={setEventCardRef}
									renderEventDetails={renderEventDetails}
								/>
							);
						})}
					</div>
				))}
			</div>
		);
	};

	return (
		<div className="max-w-full overflow-hidden">
			<h1 className="text-3xl font-bold text-[#9F3737] mb-4">
				Day-Of-Events Schedule
			</h1>

			{/* Header*/}
			<div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
				{/* Day indicator*/}
				<DayIndicator
					currentDay={currentDay}
					eventDays={eventDays}
				/>

				{/* Event type legend*/}
				<EventTypeLegend
					eventTypes={[
						{ type: "main", label: "Main Events", color: "#3b82f6" },
						{ type: "workshop", label: "Workshops", color: "#ec4899" },
						{ type: "activity", label: "Activities", color: "#8b5cf6" },
						{ type: "break", label: "Breaks", color: "#22c55e" },
					]}
				/>
			</div>

			{/* Schedule container */}
			<div className="bg-white rounded-lg overflow-hidden shadow-md">
				{/* Day header */}
				<div className="font-bold text-xl p-4 bg-[#9F3737] text-[#FFF7F2] border-b border-gray-200">
					Hackathon Schedule
				</div>

				{/* Timeline container */}
				<div
					className="relative overflow-x-auto"
					ref={timelineRef}
					onScroll={handleScroll}
				>
					{/* Time markers*/}
					{!isMobile && (
						<TimelineHeader
							hourMarkers={hourMarkers}
							hourWidth={HOUR_WIDTH}
						/>
					)}

					{/* Content container with appropriate height for all rows */}
					<div
						className={`relative max-w-full ${
							isMobile ? "h-auto" : "h-[500px]"
						}`}
						style={{
							minHeight: isMobile
								? "auto"
								: `${organizedTimeSlots.reduce(
										(height, slot) =>
											Math.max(
												height,
												slot.rows.length * (EVENT_HEIGHT + EVENT_GAP)
											),
										0
								  )}px`,
						}}
					>
						{/* Vertical time grid lines */}
						{!isMobile && (
							<div
								className="absolute inset-0"
								style={{ width: `${totalWidth}px` }}
							>
								{hourMarkers.map((_, index) => (
									<div
										key={`gridline-${index}`}
										className="absolute top-0 bottom-0 border-l border-gray-200"
										style={{
											left: `${index * HOUR_WIDTH}px`,
											height: "100%",
											zIndex: 1,
										}}
									></div>
								))}
							</div>
						)}

						{/* Events grid */}
						<div
							className="relative"
							style={{ zIndex: 2 }}
						>
							{isMobile ? renderMobileSchedule() : renderDesktopSchedule()}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventSchedule;
