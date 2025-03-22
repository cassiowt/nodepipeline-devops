var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ success: true, data: 'healthy!' });
});

router.get('/teste', (req, res) => {
    res.status(200).json({ success: true, data: 'isso é um teste!' });
});

router.get('/teste1', (req, res) => {
    res.status(200).json({ success: true, data: 'isso é um teste 1!' });
});


router.get('/teste2', (req, res) => {
    res.status(200).json({ success: true, data: 'isso é um teste 2 !' });
});


router.get('/teste3', (req, res) => {
    res.status(200).json({ success: true, data: 'isso é um teste 3!' });
});

module.exports = router;
