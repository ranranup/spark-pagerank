var gulp = require('gulp')
var fs = require('fs-extra')
var path = require('path')

var env = process.env.NODE_ENV || 'development'
var config = require('./config')[env]

var srcDir = config.srcDir || 'src'


var browserSync = require('browser-sync').create()
var proxyMiddleware = require('http-proxy-middleware')

// use default task to launch Browsersync and watch JS files
gulp.task('hot', function () {
    var proxy = []
    for (var route in config.proxyTarget) {
      proxy.push(proxyMiddleware(route, {
        target: config.proxyTarget[route]
      }))
    }    
    // Serve files from the root of this project
    browserSync.init({
        port: config.port,
        server: {
            baseDir: srcDir,
            middleware: proxy
        }
    })
  
    var specialDir =  config.notProcessedDir.map(function(dir) { 
      return '!' + srcDir + '/' + dir + '/**/*'
    })

    gulp.watch([srcDir + '/**'].concat(specialDir)).on("change", browserSync.reload);
});