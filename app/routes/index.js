const express = require('express');
const httpStatus = require('http-status');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');
const careerAdminFuncRouter = require('./career_routes');
const categoryAdminFuncRouter = require('./category_routes');
const productAdminFuncRouter = require('./product_routes');
const galleryAdminFuncRouter = require('./gallery_routes');
const articleAdminFuncRouter = require('./article_routes');
const userAdminFuncRouter = require('./user_routes');

// run dotenv
require('dotenv').config()

// routes
const routes = express();

 // env variable router
const administrator_url = process.env.ADMINISTRATOR_URL;
const career_url = process.env.CAREER_URL;
const category_url = process.env.CATEGORY_URL;
const product_url = process.env.PRODUCT_URL;
const gallery_url = process.env.GALLERY_URL;
const article_url = process.env.ARTICLE_URL;

// user routes list grouping
const userAdminRoutes = userAdminFuncRouter();
routes.use(`/${administrator_url}/users`, userAdminRoutes);

// career routes list grouping
const careerAdminRoutes = careerAdminFuncRouter();
routes.use(`/${administrator_url}/${career_url}`, careerAdminRoutes);

// category routes list grouping
const categoryAdminRoutes = categoryAdminFuncRouter();
routes.use(`/${administrator_url}/${category_url}`, categoryAdminRoutes);

// product routes list grouping
const productAdminRoutes = productAdminFuncRouter();
routes.use(`/${administrator_url}/${product_url}`, productAdminRoutes);

// gallery routes list grouping
const galleryAdminRoutes = galleryAdminFuncRouter();
routes.use(`/${administrator_url}/${gallery_url}`, galleryAdminRoutes);

// article routes list grouping
const articleAdminRoutes = articleAdminFuncRouter();
routes.use(`/${administrator_url}/${article_url}`, articleAdminRoutes);

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

// show images
const ROOT_DIR = path.resolve(__dirname, '../..');
routes.use(`/images/${product_url}/`, express.static(`${ROOT_DIR}/storage/uploads/${product_url}`));
routes.use(`/images/${gallery_url}/`, express.static(`${ROOT_DIR}/storage/uploads/${gallery_url}`));
routes.use(`/images/${article_url}/`, express.static(`${ROOT_DIR}/storage/uploads/${article_url}`));

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
