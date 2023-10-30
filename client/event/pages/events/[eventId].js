import { useRouter } from 'next/router';

const EventDetailsPage = () => {
  const router = useRouter();
  const { eventId } = router.query;

  return (
    <div>
      <h1>Event Details</h1>
      <p>Event ID: {eventId}</p>
      {/* Fetch and display event details based on eventId */}
    </div>
  );
};

export default EventDetailsPage;
