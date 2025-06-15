import Page from "../components/Page";
import EventSchedule from "../components/EventSchedule";

function Schedule() {
  return (
    <Page title="Schedule" description="View the schedule for this weekend">
      <EventSchedule />
    </Page>
  );
}

export default Schedule;
