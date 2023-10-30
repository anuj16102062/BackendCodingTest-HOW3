const express = require('express');
const router = express.Router();

const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getUserProfile,
  searchEvents,
  getAttendees,
  exportAttendeesCSV,
} = require('./controllers');

// Event Management
router.post('/events', createEvent);
router.get('/events', getEvents);
router.put('/events/:eventId', updateEvent);
router.delete('/events/:eventId', deleteEvent);
router.post('/events/:eventId/register', registerForEvent);

// User Profile
router.get('/users/:userId/profile', getUserProfile);

// Event Search
router.get('/events/search', searchEvents);

// Attendee Lists
router.get('/events/:eventId/attendees', getAttendees);
router.get('/events/:eventId/export-attendees-csv', exportAttendeesCSV);

module.exports = router;
