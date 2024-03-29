'use strict';
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const tosmmRoutes = require('./api/routes/tosmm.js');
const pokedcRoutes = require('./api/routes/pokedc.js');
const crawlerRoutes = require('./api/routes/crawler.js');

const swaggerSpec = swaggerJSDoc({
    swaggerDefinition: {
        //basePath: '/', // Base path (optional),
        // api文件網頁描述
        info: {
            title: 'LineBot API',
            version: '2.1.1',
            description: 'Generate LineBot API document with swagger'
        }
    },
    apis: ['./api/routes/*.js']
});

app.disable('x-powered-by');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use('/tosmm', tosmmRoutes);
app.use('/pokedc', pokedcRoutes);
app.use('/crawler', crawlerRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;