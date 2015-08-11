'use strict';

var path       = require('path')
  , fs         = require('fs')
  , async      = require('async');

module.exports = function (app, options, callback) {
    var files = [];
    if (options.files) {
        files = options.files;
    }

    readMultipleFilesAsync(files, function (err, certificates) {
        var server_options = [app],
            port = options.ports.default || 80;

        // Launch default server
        var default_server = launchServer(port, server_options);

        if (err) {
            return callback(null, default_server);
        }

        server_options.unshift({
            key: certificates[0],
            cert: certificates[1]
        });
        port = options.ports.secure || 443;

        // Launch secure server
        var secure_server = launchServer(port, server_options, true);

        // Add listener to redirect http requests
        default_server.addListener('request', function (req, res) {
            return res.redirect('https://' + req.headers.host + req.url);
        });

        callback(null, default_server, secure_server);
    });
};

function launchServer (port, options, secure) {
    var secure = secure || false,
        server = require(secure ? 'https' : 'http').createServer.apply(null, options);

    server.listen(port, function () {
        console.log('App launched @ %s:%s', this.address().address, this.address().port);
    });

    return server;
}

function readMultipleFilesAsync (files, callback) {
    var results = [];
    async.eachSeries(files, function (file, next) {
        fs.readFile(file, function (err, result) {
            if (err) {
                return next(err);
            }

            results.push(result);
            next();
        });
    }, function (err) {
        callback(err, results);
    });
}
