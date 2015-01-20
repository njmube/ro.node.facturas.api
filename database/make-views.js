#!/usr/bin/env node --harmony
'use strict';
const
nconf = require('nconf'), 
async   = require('async'),
request = require('request'),
views   = require('./database/views.js');

nconf.file('settings.json').env();

const url = nconf.get('databaseViews');
console.log(">>> Getting url:" + url);

async.waterfall([
  // get the existing design doc (if present)
  function(next) {
    request.get(url, next);
  },
  // create a new design doc or use existing
  function(res, body, next) {
    if (res.statusCode === 200) {
      console.log(">>> Getting status code 200");
      next(null, JSON.parse(body));
    } else if (res.statusCode === 404) {
      console.log(">>> Getting status code 404");
      next(null, { views: {} });
    }
  },
  // add views to document and submit
  function(doc, next) {
    Object.keys(views).forEach(function(name) {
      console.log(">>> Getting document");
      console.dir(doc);
      console.log(">>> Getting view");
      console.dir(views[name]);
      doc.views[name] = views[name];
    });
    request({
      method: 'PUT',
      url: url,
      json: doc
    }, next);
  }
], 
function(err, res, body) {
  if (err) { throw err; }
  console.log(res.statusCode, body);
});
