var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('<h1>Express FameWork 복잡하네 </h1>');
});

module.exports = router;
