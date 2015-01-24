'use strict';
const request = require('request'),
        nconf = require('nconf'),
      sitemap = require('./../modules/api-site-map.json'),
            Q = require('q');

nconf.file('settings.json').env();

const     url  = nconf.get('localhost'),
      urlPost  = url + sitemap.contribuyentes[1].url,
     urlDelete = url + sitemap.contribuyentes[3].url,
        urlGet = url + sitemap.contribuyentes[2].url;

let getModel = function() {
  //model pre-cargado
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
    function(err, httpResponse, body){
      logUrl("DELETE", urlDelete, httpResponse.statusCode, model);
      if (err) {
        return console.error('Error al borrar contribuyente:', err);
      }

      callback();
    });
  },

  testCrearContribuyente: function(test) {
  
    test.expect(1);

    request.post({
      url: urlPost,
      form: model
    },
    function(err, httpResponse, body) {
      let result = JSON.parse(body);
      model.id = result.id;
      model.rev = result.rev;
      logUrl("POST", urlPost, httpResponse.statusCode);

      if (err) {
        return console.error('Error al crear contribuyente:', err);
      }
      
      test.equal(httpResponse.statusCode, 201);      
      test.done();
    });
  }
}
      /*
      request.get({
        url: getUrlParams(urlGet, model)
      }, function(err, httpResponse, body){

        //logUrl("GET", urlGet, httResponse.statusCode, model);
        if (err) {
          return console.error('Error al crear contribuyente:', err);
        }
      
        let modelFromDb = JSON.parse(body);        
        test.equal(modelFromDb.id, model.id);
        test.equal(modelFromDb.rev, model.rev);
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
}*/
