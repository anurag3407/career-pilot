import swaggerJsdoc from 'swagger-jsdoc';

const isProduction = process.env.NODE_ENV === 'production';

const servers = [];
if (process.env.FRONTEND_URL) {
  servers.push({ url: process.env.BACKEND_URL || process.env.FRONTEND_URL, description: 'Production' });
}
if (!isProduction) {
  servers.push({ url: `http://localhost:${process.env.PORT || 5001}`, description: 'Local Development' });
}

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CareerPilot API',
      version: '1.0.0',
      description: 'CareerPilot API documentation',
    },
    servers,
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
