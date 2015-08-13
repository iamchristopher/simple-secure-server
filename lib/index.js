'use strict';

var path       = require('path')
  , fs         = require('fs')
  , async      = require('async');

module.exports = function (app, options, callback) {
    var files = [];
    if (options.files) {
        files = options.files;
    }

    // Launch default server
    var default_server = launchServer(
        options.ports.default || 80,
        [ app ]
    );

    if (!files.length) {
        if (typeof callback == 'function') {
            return callback(null, default_server);
        }

        return;
    }

    readMultipleFilesAsync(files, function (err, certificates) {
        if (err) {
            if (typeof callback == 'function') {
                return callback(null, default_server);
            }

            return;
        }

        // Launch secure server
        var secure_server = launchServer(
            options.ports.secure || 443,
            [
                {
                    key: certificates[0],
                    cert: certificates[1]
                },
                app
            ],
            true
        );

        // Add listener to redirect http requests
        default_server.addListener('request', function (req, res) {
            return res.redirect('https://' + req.headers.host + req.url);
        });

        if (typeof callback == 'function') {
            callback(null, default_server, secure_server);
        }
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
