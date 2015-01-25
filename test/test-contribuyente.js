'use strict';
const request = require('request'),      
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

let model = getModel();
let fechaActualizado = model.actualizado;
let fechaCreado = model.creado;

exports.testContribuyentesApi = function(test) {
  
  test.expect(34);
  
  let promise = ajax.getPromise("contribuyentes", "crear", model);
  
  let createCallback = function(args) {      
    let response = args[0], body = args[1]

    let result = JSON.parse(body);
    model.id = result.id;
    model.rev = result.rev;    
      
    test.equal(response.statusCode, 201);      
      
    return ajax.getPromise("contribuyentes", "ver", model);
  };

  let viewCallback = function(args){
    let response = args[0], body = args[1];
    let modelFromDb = JSON.parse(body);

    // verify data is saved successfully
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
    //change model
    model.rfc = 'JIGR840824T30';
    model.nombre = 'Marcos Chabolla Albarado';
    model.email = 'chabolla@test.com';
    model.calle = 'Privada de diligencias';
    model.numeroExterior = '56';
    model.numeroInterio = 'B';
    model.colonia = 'El Mirador';
    model.codigoPostal = 12345;
    model.localidad = 'Morelia';
    model.municipio = 'Morelia';
    model.estado = 'Morelos';
    //model.actualizado = Date.now();  //set by the server
    //model.creado = Date.now();       //this should not change.
          
    return ajax.getPromise("contribuyentes", "actualizar", model);
  };    

  let updatedCallback = function(args) {
    let response = args[0], body = args[1];
    test.equal(response.statusCode, 201);
    let respObj = JSON.parse(body);
    model.rev = respObj.rev;    

    return ajax.getPromise("contribuyentes", "ver", model);    
  };
    
  let verifyUpdatedCallback = function(args){
    let response = args[0], body = args[1];
    let modelFromDb = JSON.parse(body);

    // verify data is saved successfully
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
    test.notEqual(modelFromDb.actualizado, fechaActualizado);
    test.equal(modelFromDb.creado, fechaCreado);
    
    return ajax.getPromise("contribuyentes", "borrar", model);
  };

  let errorCallback = function(err) {    
    return console.error('Error: ', err);
  };


  let deleteCallback = function(args) {    
    let response = args[0], body = args[1];
    test.done();
  };

  promise.then(createCallback).then(viewCallback).then(updatedCallback).then(verifyUpdatedCallback).then(deleteCallback).catch(errorCallback).done(); 
}
