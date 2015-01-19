'use strict';
const nconf = require('nconf'),
    express = require('express'),
     router = express.Router();

nconf.file('settings.json').env();

/* GET home page. */
router.get('/', function(req, res, next) {  
  res.status(200).json({ 
	"contribuyentes": [                
		{ method: "GET",  url: "/api/contribuyentes/buscar/:rfc", desc: "Busca un contribuyente por rfc" },
		{ method: "POST", url: "/api/contribuyentes/crear/",      desc: "Crea un contribuyente" },
		{ method: "GET",  url: "/api/contribuyentes/ver/:id",     desc: "Consulta un contribuyente existente" },
		{ method: "GET",  url: "/api/contribuyentes/modelo",      desc: "Muestra el Modelo en formato JSON para esta api" }
	]
  });
});

module.exports = router;
