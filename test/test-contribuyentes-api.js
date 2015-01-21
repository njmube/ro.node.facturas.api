'use strict';
const request = require('request'),
        model = require('./../modules/contribuyente.json'),
        nconf = require('nconf'),
      sitemap = require('./../modules/api-site-map.json');

nconf.file('settings.json').env();

const urlDatabase = nconf.get('database'),
       urlDbViews = nconf.get('databaseViews'),
              url = nconf.get('localhost');


let getModel = function() {
  let model = {
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
  return model;
}

exports.testCrearContribuyente = function(test) {
  let model = getModel(); 
  test.expect(2);
  
  console.log("posting to: " + url + sitemap.contribuyentes[1].url);
  
  request.post({
    url: url + sitemap.contribuyentes[1].url,
    form: model
  },
  function(err, httpResponse, body) {
    if (err) {
      return console.error('Error al crear contribuyente:', err);
    }
    
    console.log("creado:");
    console.dir(body);
    test.equal(httpResponse.statusCode, 201);

    let model = JSON.parse(body);
    console.log("deleting to: " + url + sitemap.contribuyentes[3].url.replace(/:id/g, model.id).replace(/:rev/, model.rev));
    request.del({
      url: url + sitemap.contribuyentes[3].url.replace(/:id/g, model.id).replace(/:rev/, model.rev)
    },
    function(err, httpResponse, body){
      if (err) {
        return console.error('Error al borrar contribuyente:', err);
      }

      console.log("borrado:");
      console.dir(body);
      test.equal(httpResponse.statusCode, 200);
      test.done();

    });   
  });
}
