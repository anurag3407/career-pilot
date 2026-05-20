const swaggerJsdoc = require('swagger-jsdoc');
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CareerPilot API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      description: 'CareerPilot API documentation',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;

export default swaggerSpec;
