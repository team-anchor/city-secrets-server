const { assert } = require('chai');
// const { Types } = require('mongoose');
const tokenService = require('../../lib/auth/token-service');
const { request, checkOk } = require('./request');
const { dropCollection } = require('./db');

const makeSimple = tour => {
    const simple = {
        _id: tour._id,
        name: tour.name,
        description: tour.description,
        userId: tour.userId
    };
    return simple;
};

let muralTour, jogTour;
let token, user;

const guide = {
    name: 'guide',
    email: 'guide@test.com',
    password: 'abc'
};

describe('Tours API', () => {
    beforeEach(() => dropCollection('tours'));
    beforeEach(() => dropCollection('auths'));

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send(guide)
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
                tokenService.verify(token)
                    .then(userBody => user = userBody);
            });
    });

    beforeEach(() => {
        return request
            .post('/api/tours')
            .set('Authorization', token)
            .send({
                name: 'SE Murals',
                description: 'The best murals in SE PDX',
                userId: user.id,
                stops: [
                    {
                        location: {
                            address: '1300 SE Stark St, Portland, OR 97214',
                            picture: 'https://www.randomimage.com',
                            caption: 'This is where you start the tour! Rev Hall is dope.'
                        }
                    },
                    {
                        location: {
                            address: '923 SE 7th Ave, Portland, OR 97214',
                            picture: 'https://www.randomimage.com',
                            caption: 'This is where you finish the tour! Go eat some ramen now.'
                        }
                    }
                ]
            })
            .then(checkOk)
            .then(({ body }) => muralTour = body);
    });

    beforeEach(() => {
        return request
            .post('/api/tours')
            .set('Authorization', token)
            .send({
                name: 'SW Jogging',
                description: 'A great jogging route that ends at a nice fountain',
                userId: user.id,
                stops: [
                    {
                        location: {
                            address: '1401 SW Naito Pkwy, Portland, OR 97201',
                            picture: 'https://www.randomimage.com',
                            caption: 'Start jogging here!'
                        }
                    },
                    {
                        location: {
                            address: '1000 SW Naito Pkwy, Portland, OR 97204',
                            picture: 'https://www.randomimage.com',
                            caption: 'End jogging here! Now you can cool off in the fountain.'
                        }
                    }
                ]
            })
            .then(checkOk)
            .then(({ body }) => jogTour = body);
    });

    it('saves a tour to the database', () => {
        assert.isOk(muralTour._id);
        assert.isOk(jogTour._id);
    });

    it('gets all tours from the database', () => {
        return request
            .get('/api/tours')
            .set('Authorization', token)
            .then(({ body }) => {
                assert.deepEqual(body, [makeSimple(muralTour), makeSimple(jogTour)]);
            });
    });

    it('gets a single tour by id', () => {
        return request
            .get(`/api/tours/${muralTour._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => {
                delete muralTour.__v;
                assert.deepEqual(body, muralTour);
            });
    });

    it('updates a tour by id', () => {
        jogTour.name = 'Portland jogging';
        return request
            .put(`/api/tours/${jogTour._id}`)
            .set('Authorization', token)
            .send(jogTour)
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body.name, 'Portland jogging');
            });
    });

    it('deletes a tour by id', () => {
        return request
            .delete(`/api/tours/${muralTour._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request
                    .get('/api/tours')
                    .set('Authorization', token)
                    .then(({ body }) => {
                        delete jogTour.__v;
                        assert.equal(body.length, 1);
                        assert.deepEqual(body[0], makeSimple(jogTour));
                    });
            });
    });
});