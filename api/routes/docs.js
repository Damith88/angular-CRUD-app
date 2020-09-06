const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

var router = express.Router();

// Swagger set up
const options = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "API documentation",
        version: "1.0.0",
        description: "documentation for the API"
      },
      servers: [
        {
          url: "http://localhost:3000"
        }
      ]
    },
    apis: ['routes/*.doc.yml', 'models/*.doc.yml']
  };

  const specs = swaggerJsdoc(options);
  router.use("/docs", swaggerUi.serve);
  router.get(
    "/docs",
    swaggerUi.setup(specs, {
      explorer: true
    })
  );

module.exports = router;
