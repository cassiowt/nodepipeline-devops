const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const router = express.Router();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API
app.use('/', require('./controller/controller'));

// Server
const port = process.env.PORT;
app.listen(port, function () {
    console.log('listening on port:' + port);
});
