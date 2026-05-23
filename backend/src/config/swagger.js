import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CareerPilot API',
      version: '1.0.0',
      description: 'API documentation for CareerPilot',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      description: 'CareerPilot API documentation',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5001}`,
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
