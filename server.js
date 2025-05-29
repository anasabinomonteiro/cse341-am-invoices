require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json');

const app = express();

app.use(cors());
app.use(express.json());

//Routes
const invoiceRoutes = require('./routes/invoiceRoutes');
app.use('/api/invoices', invoiceRoutes);

const carrierRoutes = require('./routes/carrierRoutes');
app.use('/api/carriers', carrierRoutes);

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
            console.log(`🚀 Server is running on http://localhost:${process.env.PORT}`);
            console.log(`📚 Swagger UI at http://localhost:${process.env.PORT}/api-docs`);
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