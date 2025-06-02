// This file configures Passport.js for authentication strategies

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

passport.use(new LocalStrategy({ usernameField: 'email' },
    async (email, password, done) => {
        console.log('LocalStrategy called with email:', email);        
        const user = await User.findOne({ email });
        if (!user || !(await user.correctPassword(password, user.password))) {
            console.log('Authentication failed: Incorrect email or password');            
            return done(null, false, { message: 'Incorrect email or password.' });
        }
        console.log('Authentication successful for user:', user.email);
        return done(null, user);
    }
));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async (accessToken, refreshToken, profile, done) => {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value
            });
        }
        return done(null, user);
    }
));

passport.serializeUser((user, done) => 
    console.log('Serializing user:', user.id) ||
    done(null, user.id));
passport.deserializeUser(async (id, done) => {
    console.log('Deserializing user with ID:', id);
    const user = await User.findById(id);
    if (!user) {
        console.log('User not found by ID', id);
    }
    done(null, user);
});
