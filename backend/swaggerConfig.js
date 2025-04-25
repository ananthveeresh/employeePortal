const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');


// Load Mongoose models
const modelsDir = path.join(__dirname, 'model');
fs.readdirSync(modelsDir).forEach(file => {
    require(path.join(modelsDir, file))(mongoose);
});

// Load routers dynamically
const routersDir = path.join(__dirname, 'router');
fs.readdirSync(routersDir).forEach(file => {
    const router = require(path.join(routersDir, file));
    app.use(router);
});

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AbhyasV24 Junior Questionbank API',
      version: '1.0.0',
      description: 'API documentation for AbhyasV24 Junior Questionbank',
    },
  },
  // Path to the API specs
  apis: ['./router/*.router.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
