'use strict';
const request = require('request'),
        model = require('./../modules/contribuyente.json'),
        nconf = require('nconf'),
      sitemap = require('./../modules/api-site-map.json'),
      urlDatabase = nconf.get('database'),
       urlDbViews = nconf.get('databaseViews'),
              url = nconf.get('localhost');

let getModel = function() {
  let model = {
    rfc: "JIGR840824T36";
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
  return model;
}

exports.testCrearContribuyente = function(test) {
  let model = getModel();
  request.post({
    url: url + sitemap.contribuyentes[1].url,
    form: model
  },
  function(err, httpResponse, body) {
    if (err) {
      return console.error('Error al crear contribuyente:', err);
    }
    console.log('Contribuyente creado con éxito:', body);
  });
}
