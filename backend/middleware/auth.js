const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const jwt = require('jsonwebtoken');
const User = require('./models/user'); // Import your User model

const JWT_SECRET = 'your-secret-key'; // Change this to a strong secret

// Configure Passport for JWT authentication
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
}, async (jwtPayload, done) => {
  try {
    const user = await User.findById(jwtPayload.sub);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

// Generate a JWT for a user
const generateJWT = (user) => {
  const payload = {
    sub: user._id,
    iat: Date.now(),
  // You can add more user-related information here
  };
  return jwt.sign(payload, JWT_SECRET);
};

module.exports = { passport, generateJWT };
