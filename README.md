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

__files__ &mdash; Paths to certificate files
- Must be an Array valid file paths;
- The first element must be the `.key` file, and the second `.crt`.

____
#### TODO
- [ ] Allow only launching SSL server
- [ ] Launch server based on config _and_ certificate files
- [x] Make options parameter optional
- [ ] Allow custom listeners
