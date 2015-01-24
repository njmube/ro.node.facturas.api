'use strict';
const request = require('request'),
      sitemap = require('./../modules/api-site-map.json'),
         ajax = require('./../modules/ajax.js');

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

exports.testContribuyentesApi = { 

  setUp: function(callback) {
    callback();
  },

  tearDown: function(callback) {
    let promise = ajax.getPromise("contribuyentes", "borrar", model);
  
    promise.then(function(args) {
      let response = args[0], body = args[1];
      logUrl("DELETE", sitemap["contribuyentes"]["borrar"]["url"], response.statusCode, model);
      callback();
    }, function(err) {
      return console.error('Error al borrar contribuyente', err);
    });

  },

  testCrearContribuyente: function(test) {
  
    test.expect(17);
    
    let promise = ajax.getPromise("contribuyentes", "crear", model);
    
    let createCallback = function(args) {      
      let response = args[0], body = args[1];      

      let result = JSON.parse(body);
      model.id = result.id;
      model.rev = result.rev;

      logUrl("POST", sitemap["contribuyentes"]["crear"]["url"], response.statusCode);
      
      test.equal(response.statusCode, 201);      
      
      return ajax.getPromise("contribuyentes", "ver", model);
    };

    let viewCallback = function(args){
      let response = args[0], body = args[1];
      let modelFromDb = JSON.parse(body);

      logUrl("GET", sitemap["contribuyentes"]["ver"]["url"], response.statusCode, model);

      test.equal(response.statusCode, 200);     
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
    }

    let errorCallback = function(err){
      return console.error('Error: ', err);
    };

    promise.then(createCallback).then(viewCallback).catch(errorCallback).done();
   
  }
}
