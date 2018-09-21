const { assert } = require('chai');
const { request, saveAuth, checkOk } = require('./request');
const { dropCollection } = require('./db');

let userOne, userTwo, tokenOne, tokenTwo;
let userOneAuth = {
    name: 'test',
    email: 'me@me.com',
    password: '123'
};

let userTwoAuth = {
    name: 'testtest',
    email: 'test@test.com',
    password: '123'
};

describe('Users API', () => {
    beforeEach(() => dropCollection('users'));
    beforeEach(() => dropCollection('auths'));

    beforeEach(() => saveAuth(userOneAuth).then(body => {
        tokenOne = body.token;
        userOne = body.user;
    }));
    beforeEach(() => saveAuth(userTwoAuth).then(body => {
        tokenTwo = body.token;
        userTwo = body.user;
    }));

    it('saves a user', () => {
        assert.isOk(userOne._id);
        assert.isOk(userTwo._id);
    });

    it('gets a list of users', () => {
        return request
            .get('/api/users')
            .set('Authorization', tokenOne)
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body.length, 2);
            });
    });

    it('gets a user by id', () => {
        return request
            .get(`/api/users/${userOne._id}`)
            .set('Authorization', tokenOne)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, userOne);
            });
    });

    it('updates a user by id', () => {
        userOne.name = 'user One wooo';
        return request
            .put(`/api/users/${userOne._id}`)
            .set('Authorization', tokenOne)
            .send(userOne)
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body.name, 'user One wooo');
            });
    });

    it('deletes a user', () => {
        return request
            .delete(`/api/users/${userOne._id}`)
            .set('Authorization', tokenOne)
            .then(checkOk)
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request
                    .get('/api/users')
                    .set('Authorization', tokenTwo)
                    .then(checkOk)
                    .then(({ body }) => {
                        assert.equal(body.length, 1);
                    });
            });
    });
});