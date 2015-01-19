'use strict';
const nconf = require('nconf'),
    siteMap = require('./../modules/api-site-map.json'),
     modelo = require('./../modules/contribuyente.json'),
    express = require('express'),
    request = require('request'),
          Q = require('q'),
     router = express.Router();

nconf.file('settings.json').env();

/* GET home page. */
router.get('/', function(req, res, next) {  
  res.status(200).json(siteMap.contribuyentes);
});

router.get('/buscar/:rfc', function(req, res, next){
  res.status(200).json({});
});

router.post('/crear/', function(req, res, next){  
  let deferred = Q.defer();
  request.post({
    url: nconf("database"),
    json: req.body
  }, function(err, couchRes, body) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve([couchRes, body]);
    }
  });

  deferred.promise.then(function(args) {
    let couchRes = args[0], body = args[1];
    res.status(couchRes.statusCode).json(body);
  }, function(err) {
    res.status(502).json({ error: "bad_gateway", reason: err.code });
  });
  
});

router.get('/ver/:id', function(req, res, next){
  res.status(200).json({});
});

router.delete('/borrar/:id', function(req, res, next){
  res.status(200).json({});
});

router.get('/modelo/', function(req, res, next){
  res.status(200).json(modelo);
});




module.exports = router;
