const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
    // Add fields for user events
createdEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);