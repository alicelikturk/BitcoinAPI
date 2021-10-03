const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const URL = 'mongodb://localhost:27017/btcDB';
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
mongoose.Promise = global.Promise;

//
// Seed Data
//
const GlobalVariable = require("./models/globalVariable");
GlobalVariable.findOne()
    .then(gVar => {
        if (gVar == null) {
            const _gVar = new GlobalVariable({
                _id: new mongoose.Types.ObjectId(),
                confirmationCount: 13,
                autoMoving: false
            });
            _gVar
                .save()
                .then()
                .catch();
        }
    });
//
// Seed Data
//


/* Swagger */
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Bitcoin API Library",
            version: "1.0.0"
        }
    },
    server: [
        { url: "http://localhost:7078" }
    ],
    apis: ['./routes/*']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
// console.log(swaggerDocs);
var options = {
    explorer: false,
    swaggerOptions: {
        validatorUrl: null
    },
    swaggerOptions: {
        docExpansion: "none"
    }
    // customCss: '.swagger-ui .topbar { display: none }',
    // customCssUrl: '/custom.css',
    // customJs: '/custom.js'
};
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs, options));

/* Swagger */

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Alloe-Methods', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

// Routes http requests
const btcRoutes = require('./routes/btc');
const blockRoutes = require('./routes/blocks');
const clientRoutes = require('./routes/clients');
const accountRoutes = require('./routes/accounts');
const walletRoutes = require('./routes/wallets');
const globalVariableRoutes = require('./routes/globalVariables');
const notifyRoutes = require('./routes/notifies');


app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);

});

app.use((error, req, res, next) => {
    console.log(error);
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;