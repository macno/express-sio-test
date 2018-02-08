var express = require('express');
var router = express.Router();
var pack = require('../package');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: pack.name });
});

module.exports = router;
