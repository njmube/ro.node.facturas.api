'use strict';
const nconf = require('nconf'),
    siteMap = require('./../modules/api-site-map.json'),
    express = require('express'),
     router = express.Router();

nconf.file('settings.json').env();

/* GET home page. */
router.get('/', function(req, res, next) {  
  res.status(200).json(siteMap.contribuyentes);
});

module.exports = router;
