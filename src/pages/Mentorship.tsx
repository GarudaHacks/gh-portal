import { useState, useEffect } from "react";
import Page from "../components/Page";
import QuestionForm, { QuestionFormData } from "../components/QuestionForm";
import { submitTicket, getUserTickets, Ticket } from "../services/ticketService";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

function Mentorship() {
	const { user } = useAuth();
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [tickets, setTickets] = useState<Ticket[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showNotification, setShowNotification] = useState(false);

	// Fetch user tickets when component mounts or user changes
	useEffect(() => {
		if (user) {
			fetchUserTickets();
		}
	}, [user]);

	// Fetch tickets from Firestore
	const fetchUserTickets = async () => {
		if (!user) return;
		
		setIsLoading(true);
		try {
			const userTickets = await getUserTickets(user.uid);
			setTickets(userTickets);
		} catch (error) {
			console.error('Error fetching tickets:', error);
		} finally {
			setIsLoading(false);
		}
	};

	// Handle form submission
	const handleSubmitQuestion = async (formData: QuestionFormData) => {
		setIsSubmitting(true);
		try {
			const newTicket = await submitTicket(formData, user);
			
			// Add the new ticket to the state
			setTickets(prevTickets => [newTicket, ...prevTickets]);
			
			// Show success notification
			setShowNotification(true);
			setTimeout(() => setShowNotification(false), 5000);
		} catch (error) {
			console.error('Error submitting question:', error);
			alert('Failed to submit your question. Please try again.');
		} finally {
			setIsSubmitting(false);
			setIsFormOpen(false);
		}
	};

	return (
		<Page
			title="Mentorship"
			description="Submit a request or question to a mentor for help on your project."
		>
			<div className="flex flex-col gap-6">
				<div className="flex gap-4 justify-between items-center">
					<h1 className="text-2xl font-bold">
						Have a question? Ask our mentors!
					</h1>
					<button
						className="bg-[#9F3737] text-white px-4 py-2 rounded-md flex items-center gap-2"
						onClick={() => setIsFormOpen(true)}
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<>
								<Loader2 className="animate-spin mr-2" size={16} />
								<span className="font-medium">Submitting...</span>
							</>
						) : (
							<span className="font-medium">New Question</span>
						)}
					</button>
				</div>

				{/* Step-by-step guide */}
				<div className="border border-[#E5D1D1] rounded-lg p-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="flex flex-col items-left text-left">
							<div className="w-10 h-10 rounded-full bg-[#9F3737] text-white flex items-center justify-center mb-3">
								1
							</div>
							<p className="font-medium">
								Submit your request or question by clicking{" "}
								<span className="font-bold">New Question</span>. Select all
								relevant tags!
							</p>
						</div>

						<div className="flex flex-col items-left text-left">
							<div className="w-10 h-10 rounded-full bg-[#9F3737] text-white flex items-center justify-center mb-3">
								2
							</div>
							<p className="font-medium">
								Get notified on the portal and Discord when your request has
								been claimed.
							</p>
						</div>

						<div className="flex flex-col items-left text-left">
							<div className="w-10 h-10 rounded-full bg-[#9F3737] text-white flex items-center justify-center mb-3">
								3
							</div>
							<p className="font-medium">
								Follow the instructions on Discord to find your mentor!
							</p>
						</div>
					</div>
				</div>

				{/* Tickets section */}
				<div className="mt-4">
					<h2 className="text-xl font-bold mb-4">Your Tickets</h2>

					{isLoading ? (
						<div className="flex justify-center py-12">
							<Loader2 className="animate-spin text-[#9F3737]" size={32} />
						</div>
					) : tickets.length > 0 ? (
						<div className="space-y-4">
							{tickets.map((ticket) => (
								<div
									key={ticket.id}
									className="border rounded-lg p-4"
								>
									<div className="flex justify-between items-start">
										<div>
											<div className="inline-block px-2 py-1 bg-gray-200 text-gray-800 rounded-md text-sm mb-2">
												{ticket.status === "waiting"
													? "Waiting"
													: ticket.status === "claimed"
													? "Claimed"
													: "Resolved"}
											</div>
											<h3 className="text-lg font-medium">{ticket.subject}</h3>
											<p className="text-gray-700 mt-1">{ticket.description}</p>
											<p className="text-gray-600 text-sm mt-1">Location: {ticket.location}</p>

											<div className="mt-3">
												<span className="text-sm text-gray-500">Category</span>
												<div className="flex flex-wrap gap-2 mt-1">
													{ticket.categories.map((category) => (
														<span
															key={category}
															className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
														>
															{category}
														</span>
													))}
												</div>
											</div>
										</div>
										<div className="text-sm text-gray-500">
											Submitted {new Date(ticket.submittedAt).toLocaleString("en-US", {
												month: "short",
												day: "numeric",
												hour: "numeric",
												minute: "numeric",
												hour12: true,
											})}
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-12 border rounded-lg">
							<h3 className="text-xl font-medium text-[#9F3737] mb-2">
								Nothing here so far!
							</h3>
							<p className="text-gray-600">
								Create a new question and it will pop up here.
							</p>
						</div>
					)}
				</div>
			</div>

			{/* Question Form Modal */}
			<QuestionForm
				isOpen={isFormOpen}
				onClose={() => setIsFormOpen(false)}
				onSubmit={handleSubmitQuestion}
			/>

			{/* Success Notification */}
			{showNotification && (
				<div className="fixed bottom-4 right-4 bg-[#9F3737] text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-2 animate-fade-in-up">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
						<polyline points="22 4 12 14.01 9 11.01"></polyline>
					</svg>
					<span>Your ticket has been submitted!</span>
				</div>
			)}
		</Page>
	);
}

export default Mentorship;
