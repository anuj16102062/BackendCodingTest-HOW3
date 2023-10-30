const Event = require('./models/event');
const User = require('./models/user');
const { passport, generateJWT } = require('./middleware/auth.js');
// Event Management
const createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    event.createdBy = req.user._id; // Assuming you have user authentication in place
    await event.save();

    // Update user's createdEvents
    req.user.createdEvents.push(event._id);
    await req.user.save();

    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: 'Could not create the event.' });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve events.' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.eventId, req.body, { new: true });
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ error: 'Could not update the event.' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndRemove(req.params.eventId);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: 'Could not delete the event.' });
  }
};

const registerForEvent = async (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user._id; // Assuming you have user authentication in place

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ error: 'Event is full' });
    }

    if (event.attendees.includes(userId)) {
      return res.status(400).json({ error: 'You are already registered for this event' });
    }

    event.attendees.push(userId);
    await event.save();

    // Update user's registeredEvents
    req.user.registeredEvents.push(event._id);
    await req.user.save();

    res.status(200).json({ message: 'Successfully registered for the event' });
  } catch (error) {
    res.status(500).json({ error: 'Could not register for the event.' });
  }
};

// User Profile
const getUserProfile = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId)
      .populate('createdEvents')
      .populate('registeredEvents');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve user profile.' });
  }
};

// Event Search
const searchEvents = async (req, res) => {
  const { keywords, date, location } = req.query;

  const filter = {};
  if (keywords) {
    filter.$or = [{ title: { $regex: keywords, $options: 'i' } }, { description: { $regex: keywords, $options: 'i' } }];
  }
  if (date) {
    filter.date = { $gte: new Date(date) };
  }
  if (location) {
    filter.location = location;
  }

  try {
    const events = await Event.find(filter);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Could not perform the search.' });
  }
};

// Attendee Lists
const getAttendees = async (req, res) => {
  const eventId = req.params.eventId;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    const attendees = await User.find({ _id: { $in: event.attendees } });
    res.status(200).json(attendees);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve attendee list.' });
  }
};

const json2csv = require('json2csv').parse;

const exportAttendeesCSV = async (req, res) => {
  const eventId = req.params.eventId;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    const attendees = await User.find({ _id: { $in: event.attendees } });

    const fields = ['username', 'email'];
    const csv = json2csv(attendees, { fields });

    res.header('Content-Type', 'text/csv');
    res.attachment('attendees.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Could not export attendee list.' });
  }
};

// Register a new user
app.post('/register', async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password, // Hash the password before saving
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Log in a user and generate a JWT
app.post('/login', passport.authenticate('jwt', { session: false }), (req, res) => {
  const token = generateJWT(req.user);
  res.status(200).json({ token });
});

// Protected route example
app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).json({ message: 'This is a protected route' });
});

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getUserProfile,
  searchEvents,
  getAttendees,
  exportAttendeesCSV,
};
