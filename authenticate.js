const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //when use sessions to passport we need  to serialize and deserialize user.
passport.deserializeUser(User.deserializeUser());

