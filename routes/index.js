var express = require('express');
var router = express.Router();

const { connectToDB, ObjectId} = require('../utils/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { currentPage: 'home' });
});



module.exports = router;
