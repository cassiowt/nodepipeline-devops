const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const os = require('os')
const hostname = os.hostname()

const router = express.Router();
const port = 80;

app.set('view engine', 'ejs')

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API
app.use('/', require('./controller/controller'));

// Static
app.get('/index', function(req, res) {
    res.render('pages/index', {hostname : hostname, title : 'home'})
})

app.get('/about', function(req, res) {
    res.render('pages/about', {title: 'about'})
})
// Server

app.listen(port, function () {
    console.log('listening on port:' + port);
});
