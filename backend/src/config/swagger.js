import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CareerPilot API',
      version: '1.0.0',
      description: 'CareerPilot API documentation',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5002}`,
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
