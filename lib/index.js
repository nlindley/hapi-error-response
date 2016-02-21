'use strict';

const internals = {};

exports.register = (server, options, next) => {

    server.ext('onPreResponse', internals.implementation);
    next();
};

internals.implementation = (request, reply) => {

    if (request.response.isServer) {

        const payload = request.response.output.payload;

        payload.message = request.response.message;
        payload.data = request.response.data;
        payload.stack = request.response.stack.split('\n');
    }

    reply.continue();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
