const { createServer } = require('http');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { assert } = chai;

const app = require('../../lib/app');
const server = createServer(app);
const request = chai.request(server).keepOpen();

const checkOk = res => {
    assert.equal(res.status, 200, 'Expected 200 http status code');
    return res;
};

const getToken = () => request
    .post('/api/auth/signup')
    .send({
        email: 'me@me.com',
        password: '123'
    })
    .then(({ body }) => body.token);

const save = (path, data, token = null) => {
    return request
        .post(`/api/${path}`)
        .set('Authorization', token)
        .send(data)
        .then(checkOk)
        .then(({ body }) => body);
};

const saveAuth = data => {
    return request
        .post('/api/auth/signup')
        .send(data)
        .then(checkOk)
        .then(({ body }) => body);
};

const updateStops = (id, data, token) => {
    return request
        .put(`/api/tours/${id}/stops`)
        .set('Authorization', token)
        .send(data, id)
        .then(checkOk)
        .then(({ body }) => body);
};

after(done => server.close(done));

module.exports = {
    request,
    save,
    saveAuth,
    updateStops,
    checkOk,
    getToken
};