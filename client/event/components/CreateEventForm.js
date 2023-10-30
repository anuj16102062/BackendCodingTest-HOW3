import { useState } from 'react';

const CreateEventForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    maxAttendees: 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send a POST request to create the event
    // Reset the form after a successful creation
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="Event Title" />
      <textarea name="description" placeholder="Event Description" />
      <input type="datetime-local" name="date" />
      <input type="text" name="location" placeholder="Event Location" />
      <input type="number" name="maxAttendees" placeholder="Max Attendees" />
      <button type="submit">Create Event</button>
    </form>
  );
};

export default CreateEventForm;
