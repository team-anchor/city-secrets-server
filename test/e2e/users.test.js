const { assert } = require('chai');
const { request, save, saveAuth, checkOk } = require('./request');
const { dropCollection } = require('./db');

let userOne, userTwo, tokenOne, tokenTwo;
let userOneAuth = {
    email: 'me@me.com',
    password: '123'
};

let userTwoAuth = {
    email: 'test@test.com',
    password: '123'
};

let userOneProf = {
    name: 'test',  
    email: 'email@example.org',
    location: 'Portland'
};

let userTwoProf = {
    name: 'testtest',  
    email: 'test@test.com',
    location: 'Portland'
};

describe.only('Users API', () => {
    beforeEach(() => dropCollection('users'));
    beforeEach(() => dropCollection('auths'));

    beforeEach(() => saveAuth(userOneAuth).then(data => tokenOne = data.token));
    beforeEach(() => saveAuth(userTwoAuth).then(data => tokenTwo = data.token));

    beforeEach(() => save('users', userOneProf, tokenOne).then(data => userOne = data));
    beforeEach(() => save('users', userTwoProf, tokenTwo).then(data => userTwo = data));

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
                    .get('/api/users');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body.length, 1);
            });
    });
});