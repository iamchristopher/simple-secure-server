# Simple Secure Server
A simple module to instantiate a secure ExpressJS server based on environment.

## Installation
```js
npm i simple-secure-server
```

## Default Example
The following will launch an ExpressJS server, without SSL.
```js
require('simple-secure-server')(app);
```

## Secure Example
The following will launch _both_ the default server as well as one with SSL.
```js
require('simple-secure-server')(app, {
    files: [
        '/path/to/site.key',
        '/path/to/site.crt'
    ]
});
```

##More Examples
You can also supply a callback method which gives you access to an error object (if applicable), the default server, and the secure server (if launched). This can be done with or without `options` provided.
```js
require('simple-secure-server', app, [options, ] function (err, default, secure) {
    // ...
});
```

## Configuration
The module accepts a configuration object as an optional second parameter.
```js
require('simple-secure-server')(app, {
    ports: {
        default: 80
    }
});
```

### Options
__ports__ &mdash; Specify which ports should be used
- Must be an Integer;
- Defaults to 80 for _default_ and 443 for _secure_

__secureRedirect__ &mdash; Redirects requests from `http://` to `https://`
- Must be a Boolean;
- Defaults to `true`, when secure server is available.

__files__ &mdash; Paths to certificate files
- Must be an Array valid file paths;
- The first element must be the `.key` file, and the second `.crt`.

____
#### TODO
- [ ] Allow only launching SSL server
- [x] Launch server based on config _and_ certificate files
- [x] Make options parameter optional
- [ ] Allow custom listeners
