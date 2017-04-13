var express = require("express")
var app = express()
var env = process.env.NODE_ENV || 'development'
var config = require('./config')[env]
var proxy = require('http-proxy-middleware')

var staticDir = config.srcDir

var sendFile = function (req, res, filename) {
	var sendFileOptions = {
		root: __dirname + '/' + staticDir,
		dotfiles: 'deny',
		headers: {
		    'x-timestamp': Date.now(),
		    'x-sent': true
	 }
	}

  	var fileName = filename
  	res.sendFile(fileName, sendFileOptions, function (err) {
	    if (err) {
	      console.log(err);
	      res.status(err.status).end();
	    }
	    else {
	      console.log('Sent:', fileName);
	    }
  	})	
}

app.get('/', function(req, res) {
	sendFile(req, res, 'index.html')
})

// don't redirect /
// app.all(/\/$/, function(req, res) {
// 	res.redirect(req.originalUrl.slice(0, -1));
// })

// don't cache index.html,login.html
app.get(/^\/[\w0-9.-]*\.html$/, function(req, res) {
	sendFile(req, res, req.originalUrl)
})

console.log('serve static files in ' + staticDir)
app.use(express.static(staticDir))


for (var route in config.proxyTarget) {
	console.log('proxy ' + route +' to :::' + config.proxyTarget[route].http)
	app.use(route, proxy({
		target: config.proxyTarget[route]
	}))
}


var port = config.port

app.listen(port, function(err) {
	if (err) {
		console.error(err)
	} else {
		console.log('server start at: ' + port)
	}
})

