const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Invoice API',
        description: 'API for managing invoices and carriers',
    },
    host: process.env.SWAGGER_HOST || 'localhost:3000',
    schemes: [process.env.SWAGGER_SCHEME || 'http'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./server.js'];

// Generate the Swagger documentation
swaggerAutogen(outputFile, endpointsFiles, doc)
    .then(() => {
        console.log('Swagger documentation generated successfully.');
    })
    .catch((error) => {
        console.error('Error generating Swagger documentation:', error);
    });

