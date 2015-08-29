'use strict';

var path       = require('path')
  , fs         = require('fs')
  , async      = require('async')
  , extend     = require('extend');

module.exports = function (app, options, callback) {

    // Swap options and callback values if options are omitted entirely
    if (typeof options == 'function') {
        callback = options;
        options = {};
    }

    var _options = extend(true, {}, {
        ports: {
            default: 80,
            secure: 443
        },
        secureRedirect: true,
        files: []
    }, options);

    // Launch default server
    var default_server = launchServer(
        _options.ports.default,
        [ app ]
    );

    if (!_options.files.length) {
        if (typeof callback == 'function') {
            return callback(null, default_server);
        }

        return;
    }

    readMultipleFilesAsync(_options.files, function (err, certificates) {
        if (err) {
            if (typeof callback == 'function') {
                return callback(err, default_server);
            }

            return;
        }

        // Launch secure server
        var secure_server = launchServer(
            _options.ports.secure,
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
        if (_options.secureRedirect) {
            default_server.addListener('request', function (req, res) {
                return res.redirect('https://' + req.headers.host + req.url);
            });
        }

        if (typeof callback == 'function') {
            callback(null, default_server, secure_server);
        }
    });
};

function launchServer (port, options, secure) {
    var secure = secure || false,
        server = require(secure ? 'https' : 'http').createServer.apply(null, options);

    return server.listen(port);
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
