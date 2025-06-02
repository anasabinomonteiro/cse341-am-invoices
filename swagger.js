const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Invoices & Carriers API',
        description: 'API for managing invoices and carriers',
    },
    host: process.env.SWAGGER_HOST || 'localhost:3000',
    schemes: [process.env.SWAGGER_SCHEME || 'http'],

    tags: [
        {
            name: 'Authentication',
            description: 'User authentication and authorization',
        },
        {
            name: 'Invoices',
            description: 'Operations related to invoices',
        },
        {
            name: 'Carriers',
            description: 'Operations related to carriers',
        },
        {
            name: 'Home',
            description: 'Welcome message for API root',
        },
    ],
    // Security Definitions
    securityDefinitions: {
        BearerAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
        }
    },
    security: [
        {
            BearerAuth: []
        }
    ],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/invoiceRoutes.js', './routes/carrierRoutes.js', './routes/authRoutes.js'];

// Generate the Swagger documentation
swaggerAutogen(outputFile, endpointsFiles, doc)
    .then(() => {
        console.log('Swagger documentation generated successfully.');
    })
    .catch((error) => {
        console.error('Error generating Swagger documentation:', error);
    });

