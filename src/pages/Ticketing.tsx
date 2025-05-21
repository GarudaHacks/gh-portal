import Page from "../components/Page";
import { ticketDescription } from "../data/copywriting";
import Ticket from "../components/Ticket";

function Ticketing() {
  return (
    <Page
      title="Ticket"
      description="View your ticket for the event and check in at Garuda Hacks 6.0."
    >
      <div className="flex sm:flex-col md:flex-row md:gap-4">
        {ticketDescription}
        <Ticket />
      </div>
    </Page>
  );
}

export default Ticketing;
