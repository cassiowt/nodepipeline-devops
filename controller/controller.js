var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ success: true, data: 'healthy!' });
});

router.get('/teste', (req, res) => {
    res.status(200).json({ success: true, data: 'isso é um teste!' });
});

module.exports = router;
