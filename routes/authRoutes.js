// This file defines the routes for user authentication, including registration, login, and social login using Google.

const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');

router.get('/',
    /* #swagger.tags = ['Authentication']
       #swagger.path = '/api/auth'
       #swagger.summary = 'Authentication API Welcome message'
       #swagger.description = 'This endpoint provides a welcome message for the authentication API.'
       #swagger.responses[200] = {
           description: 'Welcome message',
           schema: {
               message: 'Welcome to the authentication API!'
           }
       }
    */
    (req, res) => {
        res.status(200).json({ message: 'Welcome to the authentication API!' });
    });


router.post('/register',
    /* #swagger.tags = ['Authentication']
       #swagger.path = '/api/auth/register'
       #swagger.summary = 'Register a new user'
       #swagger.description = 'Register a new user with email and password.'
       #swagger.parameters['body'] = {
           in: 'body',
           required: true,
           schema: {
               email: 'test@google.com',
               password: 'your_strong_password'
           }
       }
       #swagger.responses[201] = {
           description: 'User registered successfully',
           schema: {
               message: 'User registered successfully',
               user: {
                   _id: '1234567890abcdef',
                   email: 'test@google.com'
               }
           }
       }
       #swagger.responses[409] = {
           description: 'Email already exists'
       }
       #swagger.responses[400] = {
           description: 'Error registering user'
       }
    */
    async (req, res) => {
        try {
            const newUser = await User.create(req.body);
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({ message: 'Email already exists' });
            }
            res.status(400).json({ message: 'Error registering user', error: error.message });
        }
    });


router.post('/login',
    /* #swagger.tags = ['Authentication']
       #swagger.path = '/api/auth/login'
       #swagger.summary = 'Login a user'
       #swagger.description = 'Authenticates a user with email and password using local strategy.'
       #swagger.parameters['body'] = {
           in: 'body',
           required: true,
           schema: {
               email: 'test@google.com',
               password: 'your_strong_password'
           }
       }
       #swagger.responses[200] = {
           description: 'User logged in successfully',
           schema: {
               message: 'Logged in successfully',
               user: {
                   _id: '1234567890abcdef',
                   email: 'test@google.com'
               }
           }
       }
       #swagger.responses[401] = {
           description: 'Invalid email or password'
       }
    */
    passport.authenticate('local'), (req, res) => {
        console.log('User logged in:', req.user.email);
        res.json({ message: 'Logged in successfully', user: req.user });
    });


router.get('/google',
    /* #swagger.tags = ['Authentication']
       #swagger.path = '/api/auth/google'
       #swagger.summary = 'Authenticate with Google OAuth'
       #swagger.description = 'Redirects to Google for OAuth authentication.'
       #swagger.responses[302] = {
           description: 'Redirects to Google for authentication'
       }
    */
    passport.authenticate('google', { scope: ['profile', 'email'] }));


router.get('/google/callback',
    /* #swagger.tags = ['Authentication']
       #swagger.path = '/api/auth/google/callback'
       #swagger.summary = 'Google OAuth callback'
       #swagger.description = 'Callback URL for Google OAuth, handles success and failure redirects.'
       #swagger.responses[302] = {
           description: 'Redirects to /profile on success or /login on failure'
       }
    */
    passport.authenticate('google', {
        failureRedirect: '/login',
        successRedirect: '/profile'
    }));


router.get('/logout',
    /* #swagger.tags = ['Authentication']
       #swagger.path = '/api/auth/logout'
       #swagger.summary = 'Logout current user'
       #swagger.description = 'Logs out the currently user and destroys the session.'
       #swagger.responses[200] = {
           description: 'User logged out successfully',
           schema: {
               message: 'Logged out successfully'
           }
       }
       #swagger.responses[500] = {
           description: 'Error logging out user'
       }
    */
    (req, res, next) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.session.destroy((err) => {
                if (err) {
                    return next(err);
                }
                res.json({ message: 'Logged out successfully' });
            });
        });
    });

module.exports = router;