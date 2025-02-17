const express = require('express');
const client = require('prom-client');
const app = express();
const register = new client.Registry();
const path = require('path');
const bodyParser = require('body-parser');
const os = require('os')
const hostname = os.hostname()

const router = express.Router();
const port = 3000;
 
// Configurar métricas padrão (CPU, Heap, Event Loop)
client.collectDefaultMetrics({ register });

// Criar uma métrica personalizada
const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total de requisições HTTP recebidas',
    labelNames: ['method', 'route', 'status_code']
});
register.registerMetric(httpRequestCounter);

app.set('view engine', 'ejs')

// Middlewares
app.use((req, res, next) => {
    res.on('finish', () => {
        httpRequestCounter.inc({ method: req.method, route: req.path, status_code: res.statusCode });
    });
    next();
});

// Rota de métricas para Prometheus


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API
app.use('/', require('./controller/controller'));

//Metrics
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

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
