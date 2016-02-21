'use strict';

// Load modules

const Code = require('code');
const Hapi = require('hapi');
const Lab = require('lab');
const Boom = require('boom');


// Test shortcuts

const lab = exports.lab = Lab.script();
const it = lab.it;
const expect = Code.expect;


it('returns full server errors', (done) => {

    const server = new Hapi.Server({ debug: false });

    server.connection();
    server.register(require('../'), (err) => {

        expect(err).to.not.exist();

        server.route({
            method: 'GET',
            path: '/',
            handler: (request, reply) => {

                reply(Boom.badImplementation('Some developer error', {
                    prop1: 'val1',
                    prop2: 'val2'
                }));
            }
        });

        const request = {
            method: 'GET',
            url: '/'
        };

        server.inject(request, (res) => {

            expect(res.result.data).to.deep.equal({
                prop1: 'val1',
                prop2: 'val2'
            });
            expect(res.result.message).to.equal('Some developer error');
            expect(res.statusCode).to.equal(500);
            expect(res.result.stack).to.be.an.array();

            done();
        });
    });
});


it('does not modify client errors', (done) => {

    const server = new Hapi.Server();

    server.connection();
    server.register(require('../'), (err) => {

        expect(err).to.not.exist();

        const providedResponse = Boom.notFound('Some developer error', {
            prop1: 'val1',
            prop2: 'val2'
        });

        server.route({
            method: 'GET',
            path: '/',
            handler: (request, reply) => {

                reply(providedResponse);
            }
        });

        const request = {
            method: 'GET',
            url: '/'
        };

        server.inject(request, (res) => {

            expect(res.result).to.include(providedResponse.output.payload);
            expect(res.statusCode).to.equal(404);
            expect(res.result.stack).to.be.undefined();

            done();
        });
    });
});
