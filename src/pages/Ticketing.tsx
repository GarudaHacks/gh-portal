import Page from "../components/Page";
import { ticketDescription } from "../assets/data/copywriting";
import Ticket from "../components/Ticket";

function Ticketing() {
	return (
		<Page title="Ticket" description="View your ticket for the event and check in at Garuda Hacks 6.0.">
			<div className="grid sm:grid-cols-1 md:grid-cols-2 md:gap-4 text-sm">
				{ticketDescription}
				<Ticket />
			</div>
		</Page>
	);
}

export default Ticketing;
