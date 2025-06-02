require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json');
require('./config/passport'); // Passport configuration

// Importing MongoDB session store for use on Render (cookies are not persistent)
const MongoStore = require('connect-mongo');

// Verify variables
if (!process.env.MONGODB_URI || !process.env.SESSION_SECRET || !process.env.NODE_ENV) {
    console.error('❌ Missing required environment variables. Please check your .env file.');
    process.exit(1);
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 1000 * 60 * 60 * 24 // 1 day
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    } // Use secure cookies in production   
}));

app.use(passport.initialize());
app.use(passport.session());

// Auth Middleware
const { isAuthenticated } = require('./middleware/auth');

//Routes
const invoiceRoutes = require('./routes/invoiceRoutes');
app.use('/api/invoices', isAuthenticated, invoiceRoutes);

const carrierRoutes = require('./routes/carrierRoutes');
app.use('/api/carriers', isAuthenticated, carrierRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Home Page
app.get('/', (req, res) => {
    // #swagger.tags = ['Home']
    // #swagger,description = 'Welcome message for API root'
    res.send('Welcome to the Invoice API');
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(process.env.PORT, () => {
            console.log(`🚀 Server is running on port${process.env.PORT}`);
            console.log(`📚 Swagger UI at /api-docs`);
        });
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
    });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: err.message
    });
});