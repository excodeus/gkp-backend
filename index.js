const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mySQLConnection = require('./app/providers/mysql/index.js');
const routes = require('./app/routes/index.js');

// run dotenv
require('dotenv').config()

const startApp = async () => {
    try {
        const ROOT_DIR = __dirname;
        // express app
        const app = express();

        // config express json
        app.use(express.json());
        app.use(express.urlencoded({extended: true}));
        app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
        
        // cors
        app.use(cors());

        // mysql
        const mySQLConn = await mySQLConnection();
        if (mySQLConn) {
            console.log('Connected to MySQL');
            mySQLConn.end();
        }

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