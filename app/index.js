const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');

// run dotenv
require('dotenv').config()

const startApp = async () => {
    try {
        // init dev
        // express app
        const app = express();

        // config express json
        app.use(express.json());
        app.use(express.urlencoded({extended: true}));
        app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
        
        // cors
        app.use(cors());
        
        // routes
        const baseUrl = process.env.BASE_URL;
        app.use(baseUrl, routes);

        // port app
        const port = process.env.APP_PORT || 3000;
        // run server
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.log(error.message);
    }
}


// run app
startApp();