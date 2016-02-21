# hapi-error-response

This is a simple Hapi plugin to demonstrate adding properties to the payload when the response is a server error.

## Usage

```javascript
const Hapi = require('hapi');
const Boom = require('boom');

const server = new Hapi.Server();

server.connection();

server.register(require('hapi-error-response'), (err) => {

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, reply) => reply(Boom.badImplementation('something wen wrong', { customData: 'here'}))
    });
});
```
