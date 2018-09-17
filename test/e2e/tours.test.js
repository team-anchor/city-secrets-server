const { assert } = require('chai');
const { Types } = require('mongoose');
const { request, save, checkOk } = require('./request');
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

const mural = {
    name: 'SE Murals',
    description: 'The best murals in SE PDX',
    userId: Types.ObjectId(),
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
};

const jog = {
    name: 'SW Jogging',
    description: 'A great jogging route that ends at a nice fountain',
    userId: Types.ObjectId(),
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
};

const guide = {
    email: 'guide@test.com',
    password: 'abc'
};

describe('Tours API', () => {
    let token;

    beforeEach(() => dropCollection('tours'));
    beforeEach(() => dropCollection('auths'));

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send(guide)
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });

    beforeEach(() => save('tours', mural, token).then(data => muralTour = data));
    beforeEach(() => save('tours', jog, token).then(data => jogTour = data));

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
});