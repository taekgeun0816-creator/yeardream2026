const express = require('express');
const router = express.Router();

router.get('/hello', (req, res) => {
    res.send('Router Module, GET!!');
});

router.post('/hello', (req, res) => {
    res.send('Router Module, POST!!');
});

module.exports = router;