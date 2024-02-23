const express = require('express');
const httpStatus = require('http-status');

// routes
const routes = express();

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
