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

// Trust first proxy for secure cookies in production
app.set('trust proxy', 1);

// --- MIDDLEWARE DEBUG ---
app.use((req, res, next) => {
    console.log(`[REQ START] ${new Date().toISOString()} - ${req.method} ${req.url} - IP: ${req.ip}`);
    console.log(`[DEBUG] Request Protocol: ${req.protocol}, Secure: ${req.secure}`);
    res.on('finish', () => {
        console.log(`[REQ END] ${new Date().toISOString()} - ${req.method} ${req.url} - Status: ${res.statusCode}`);
        if (res.get('Set-Cookie')) { // Verify the presence of Set-Cookie header
            console.log(`[REQ END] Set-Cookie header found: ${res.get('Set-Cookie')}`);
        } else {
            console.log(`[REQ END] No Set-Cookie header found.`);
        }
    });
    next();
});
// --- END MIDDLEWARE DEBUG ---

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
        ttl: 60 * 60 // 1 hour
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60  // 1 hour
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