const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const { checkOk } = request;

describe('Auth API', () => {

    beforeEach(() => dropCollection('auths'));

    let token;
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                email: 'me@me.com',
                password: '123'
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });

    it('Signs up a user', () => {
        assert.isDefined(token);
    });

    it('Verifies a token', () => {
        return request
            .post('/api/auth/signin')
            .send({
                email: 'me@me.com',
                password: '123'
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.isDefined(body.token);
            });
    });
});