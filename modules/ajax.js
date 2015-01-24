'use strict';
const  express = require('express'),
       request = require('request'),
             Q = require('q'),
       sitemap = require('./api-site-map.json'),
         nconf = require('nconf');

nconf.file('settings.json').env();
const hostUrl = nconf.get('localhost');

function setUrlParams(url, model) {
 if (model) {
    url = url.replace(/:id/g, model.id).replace(/:rev/, model.rev);
  }
  return url;
}

function getRequest(group, name, model) {  
  switch(sitemap[group][name]["method"]){
    case "GET":
        return request.get;
    case "POST":
        return request.post;
    case "PUT":
        return request.put;
    case "DELETE":
        return request.del;
  }
  return request.get;
}

function getRequestConfig(group, name, model){
  let method = sitemap[group][name]["method"];  
  let reqUrl = hostUrl + sitemap[group][name]["url"];
  
  if (method != "POST" && method != "PUT"){
    return { url: setUrlParams(reqUrl, model) };
  }
 
  return {
    url: setUrlParams(reqUrl, model),
    form: model
  }
  
}

exports.getPromise = function(group, name, model) {
  let deferred = Q.defer();
  let req = getRequest(group, name);
  let conf = getRequestConfig(group, name, model);
  
  req(conf, function(err, response, body) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve([response, body]);
    }
  });

  return deferred.promise;
}
