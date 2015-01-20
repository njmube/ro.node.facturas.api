'use strict';
const nconf = require('nconf'),
    siteMap = require('./../modules/api-site-map.json'),
     modelo = require('./../modules/contribuyente.json'),
    express = require('express'),
    request = require('request'),
          Q = require('q'),
     router = express.Router();

nconf.file('settings.json').env();
let url = nconf.get("database");
let urlViews = nconf.get("databaseViews");

/* GET home page. */
router.get('/', function(req, res, next) {  
  res.status(200).json(siteMap.contribuyentes);
});

router.get('/buscar/:rfc', function(req, res, next){
  request.get({
    url: urlViews + "_view/por_rfc",
    qs:{
      startkey: JSON.stringify(req.query.q),
      endkey: JSON.stringify(req.query.q + "\ufff0")
    }
  }, function(err, couchRes, body){
    // couldn't connect to CouchDB
    if (err) {
      res.status(502).json({ error: "bad_gateway", reason: err.code });
      return;
    }
    // CouchDB couldn't process our request
    if (couchRes.statusCode !== 200) {
      res.status(couchRes.statusCode).json(JSON.parse(body));
      return;
    }

    res.json(JSON.parse(body).rows.map(function(elem){
      return elem.key;
    }));
  });
});

router.post('/crear/', function(req, res, next){  
  req.accepts('application/json');

  let deferred = Q.defer();
  request.post({
    url: url,
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
  request.get({
    url: urlViews + "?rev=" + req.query.id
  }, function(err, couchRes, body){
    // couldn't connect to CouchDB
    if (err) {
      res.status(502).json({ error: "bad_gateway", reason: err.code });
      return;
    }
    // CouchDB couldn't process our request
    if (couchRes.statusCode !== 200) {
      res.status(couchRes.statusCode).json(JSON.parse(body));
      return;
    }

    res.status(200).json(JSON.parse(body));
  });

});

router.delete('/borrar/:id', function(req, res, next){
  request.delete({
    url: urlViews + "?rev=" + req.query.id
  }, function(err, couchRes, body){
    // couldn't connect to CouchDB
    if (err) {
      res.status(502).json({ error: "bad_gateway", reason: err.code });
      return;
    }
    // CouchDB couldn't process our request
    if (couchRes.statusCode !== 200) {
      res.status(couchRes.statusCode).json(JSON.parse(body));
      return;
    }

    res.status(200).json(JSON.parse(body));
  });

});

router.get('/modelo/', function(req, res, next){
  res.status(200).json(modelo);
});




module.exports = router;
