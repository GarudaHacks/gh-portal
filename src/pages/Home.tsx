import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
// @ts-ignore
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";

function Home() {
	const user = useAuth();

	const registrationsClose = new Date("2025-06-31T10:14:00").getTime();
	const hackathonEndTime = new Date("2025-07-17T10:14:00").getTime();

	const getShortName = () => {
		if (!user?.user?.displayName) return "User";
		const alphabetsOnly = user.user.displayName.replace(/[^a-zA-Z]/g, "");
		return alphabetsOnly.substring(0, 3);
	};

	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	/**
	 * Counts down time to registration closing or hacking end time
	 */
	useEffect(() => {

		const updateTimer = () => {
			const now = new Date().getTime();
			const usedTime = now < registrationsClose ? registrationsClose : hackathonEndTime
			const distance = usedTime - now;
			
			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor(distance / (1000 * 60 * 60));
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((distance % (1000 * 60)) / 1000);

			if (distance <= 0) {
				setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
				clearInterval(timerInterval);
			} else {
				setTimeLeft({ days, hours, minutes, seconds });
			}
		};

		updateTimer();

		const timerInterval = setInterval(updateTimer, 1000);

		return () => clearInterval(timerInterval);
	}, []);

	return (
		<div className="flex">
			<Sidebar />
			<div className="flex-1 bg-[#FFF7F2] text-[#9F3737]">
				<PageHeader title="Home" description="View all important announcements and events here."/>

				<div className="p-10 pt-4 pb-4">
					<div className="flex justify-between items-center mb-6 text-[28px] font-semibold">
						<h2>Good morning, {getShortName()}! 👋</h2>
						<div className="flex gap-4 text-[14px] font-[600]">
							<button className="group px-4 py-2 border bg-[#9F3737] text-[#FFF7F2] rounded flex items-center transition duration-300 hover:opacity-80 cursor-pointer">
								View event booklet
								<span className="ml-2">
									<img
										src="/images/icons/arrow_outward.svg"
										width={20}
										height={20}
									/>
								</span>
							</button>
							<button className="px-4 py-2 border border-[#A83E36] text-[#A83E36] rounded transition-colors duration-300 hover:bg-[#A83E36] hover:text-white">
								Judging Schedule
							</button>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-10">
					<div className="border border-[#A83E36] rounded-lg p-6 px-8">
						<h3 className="text-sm uppercase font-semibold text-[#A83E36] mb-4 text-[1.2rem]">
							{registrationsClose ? "REGISTRATION CLOSES IN" : "HACKING CLOSES IN"}
						</h3>
						<div className="flex flex-wrap justify-center gap-2 md:gap-4 text-center">
							<div className="flex flex-col items-center">
								{(timeLeft.hours > 100) ? (
									<>
										<div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#A83E36]">
											{timeLeft.days.toString().padStart(2, "0")}
										</div>
										<div className="text-[#A83E36]">days</div>
									</>
								) : (
									<>
										<div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#A83E36]">
											{timeLeft.hours.toString().padStart(2, "0")}
										</div>
										<div className="text-[#A83E36]">hours</div>
									</>
								)}
							</div>
							<div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#A83E36]">
								:
							</div>
							<div>
								<div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#A83E36]">
									{timeLeft.minutes.toString().padStart(2, "0")}
								</div>
								<div className="text-[#A83E36]">minutes</div>
							</div>
							<div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#A83E36]">
								:
							</div>
							<div>
								<div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#A83E36] w-[7rem]">
									{timeLeft.seconds.toString().padStart(2, "0")}
								</div>
								<div className="text-[#A83E36]">seconds</div>
							</div>
						</div>
					</div>

					<div className="border border-[#A83E36] rounded-lg p-6">
						<h3 className="text-2xl font-semibold text-[#A83E36] mb-4">
							Judging Information
						</h3>
						<p className="mb-2 text-sm">
							Submissions for Garuda Hacks 6.0 will be handled on{" "}
							<a
								href="#"
								className="text-[#A83E36] font-semibold hover:underline"
							>
								Devpost
							</a>
							!
						</p>
						<p className="mb-4 text-sm">
							Please read the{" "}
							<a
								href="#"
								className="text-[#A83E36] font-semibold hover:underline"
							>
								Submission Guidelines
							</a>{" "}
							and{" "}
							<a
								href="#"
								className="text-[#A83E36] font-semibold hover:underline"
							>
								Judging Instructions and FAQ
							</a>{" "}
							before submitting.
						</p>
						<p className="text-sm">
							Check back here after hacking period has ended for your judging
							information and time.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;
