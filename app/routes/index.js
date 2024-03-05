const express = require('express');
const httpStatus = require('http-status');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');
const careerAdminFuncRouter = require('./career_routes');

// run dotenv
require('dotenv').config()

// routes
const routes = express();

 // env variable router
const administrator_url = process.env.ADMINISTRATOR_URL;
const career_url = process.env.CAREER_URL;

// career routes list grouping
const careerAdminRoutes = careerAdminFuncRouter();
routes.use(`/${administrator_url}/${career_url}`, careerAdminRoutes);

// swagger
// Read and process Swagger YAML
const swaggerYaml = fs.readFileSync('./app/docs/swagger.yaml', 'utf8');
const processedSwaggerYaml = swaggerYaml.replace(/\${(.*?)}/g, (match, p1) => {
    return process.env[p1.trim()];
});
// Load processed Swagger YAML
const swaggerDocument = yaml.load(processedSwaggerYaml);
// Serve Swagger documentation
routes.use(process.env.SWAGGER_URL, swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// test endpoint
routes.get('/ping', (req, res) => {
    const responseData = {
        error: false,
        message: 'pong!',
    };
    return res.json(responseData);
});

// handle random or undefined routes
routes.get('*', (req, res) => {
    const responseData = {
        error: false,
        message: '404 NOT FOUND!',
    };
    return res.status(httpStatus.NOT_FOUND).json(responseData);
});

module.exports = routes;
