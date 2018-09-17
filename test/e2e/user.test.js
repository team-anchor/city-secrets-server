const { assert } = require('chai');
const { request } = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe ('Users API', () => {

    beforeEach(() => dropCollection('users'));
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
                console.log(token);
            });
    });

    function saveUser(user) {
        return request
            .post('/api/users')
            .set('Authorization', token)
            .send(user)
            .then(checkOk)
            .then(({ body }) => {
                delete body.__v;
                console.log(body);
                return body;
            });
    }

    let joe;
    beforeEach(() => {
        return saveUser({
            name: 'Joe Walker',  
            email: 'email@example.org',
            location: 'Portland'
        })
            .then(data => {
                joe = data;
                console.log(joe);
            });

    });

    it('Saves a user', () => {
        assert.isOk(joe._id);
    });
});