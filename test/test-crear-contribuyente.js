'use strict';
const request = require('request'),
        nconf = require('nconf'),
      sitemap = require('./../modules/api-site-map.json');

nconf.file('settings.json').env();

const      url = nconf.get('localhost'),
       urlPost = url + sitemap.contribuyentes[1].url,
     urlDelete = url + sitemap.contribuyentes[3].url,
        urlGet = url + sitemap.contribuyentes[2]i.url;

let getModel = function() {
  let c = {
    id: "",
    rev: "",
    rfc: "JIGR840824T36",
    nombre: "Rodrigo Damian Jiménez García",
    email: "correo.rodrigo@gmail.com",
    calle: "Justo Sierra",
    numeroExterior: "60",
    numeroInterior: "",
    colonia: "Jorhentpiri",
    codigoPostal: 60074,
    localidad: "Uruapan",
    municipio: "Uruapan",
    estado: "Michoacán",
    actualizado: Date.now(),
    creado: Date.now()
  }
  return c;
}

function setUrlParams(url, model) {
 if (model) {
    url = url.replace(/:id/g, model.id).replace(/:rev/, model.rev);
  }
  return url;
}

function logUrl(method, url, statusCode, model) {
  console.log("[" + method + "] " + setUrlParams(url, model) + " " + statusCode);
}

let model = getModel();

exports.testCreate = { 

  setUp: function(callback) {
    callback();
  },

  tearDown: function(callback) {
    request.del({
      url: setUrlParams(urlDelete, model)
    },
    function(err, response, body){
      logUrl("DELETE", urlDelete, response.statusCode, model);
      if (err) {
        return console.error('Error al borrar contribuyente:', err);
      }

      callback();
    });
  },

  testCrearContribuyente: function(test) {
  
    test.expect(17);

    request.post({
      url: urlPost,
      form: model
    },
    function(err, response, body) {
      let result = JSON.parse(body);
      model.id = result.id;
      model.rev = result.rev;
      logUrl("POST", urlPost, response.statusCode);

      if (err) {
        return console.error('Error al crear contribuyente:', err);
      }
      
      test.equal(response.statusCode, 201);      
       
      request.get({
        url: setUrlParams(urlGet, model)
      }, function(err, response, body){
        
        logUrl("GET", urlGet, response.statusCode, model);
        if (err) {
          return console.error('Error al obtener contribuyente:', err);
        }
        
        test.equal(response.statusCode, 200);
        let modelFromDb = JSON.parse(body);        
        test.equal(modelFromDb._id, model.id);
        test.equal(modelFromDb._rev, model.rev);
        test.equal(modelFromDb.rfc, model.rfc);        
        test.equal(modelFromDb.nombre, model.nombre);
        test.equal(modelFromDb.email, model.email);
        test.equal(modelFromDb.calle, model.calle); 
        test.equal(modelFromDb.numeroExterior, model.numeroExterior);
        test.equal(modelFromDb.numeroInterior, model.numeroInterior);
        test.equal(modelFromDb.colonia, model.colonia);
        test.equal(modelFromDb.codigoPostal, model.codigoPostal);
        test.equal(modelFromDb.localidad, model.localidad);
        test.equal(modelFromDb.municipio, model.municipio);
        test.equal(modelFromDb.estado, model.estado);
        test.equal(modelFromDb.actualizado, model.actualizado);
        test.equal(modelFromDb.creado, model.creado);
        test.done();
      });
      
    });
  }
}