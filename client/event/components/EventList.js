import Link from 'next/link';

const EventList = () => {
  // Fetch and map a list of events
  const events = [
    { id: 1, title: 'Event 1' },
    { id: 2, title: 'Event 2' },
    // Add more events
  ];

  return (
    <ul>
      {events.map((event) => (
        <li key={event.id}>
          <Link href={`/events/${event.id}`}>
            <a>{event.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default EventList;
