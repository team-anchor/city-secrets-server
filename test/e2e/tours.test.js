const { assert } = require('chai');
const tokenService = require('../../lib/auth/token-service');
const { request, checkOk } = require('./request');
const { dropCollection } = require('./db');

const makeSimple = tour => {
    const simple = {
        _id: tour._id,
        name: tour.name,
        stops: tour.stops,
        description: tour.description,
        userid: tour.userid,
        city: tour.city,
        tourimage: tour.tourimage
    };
    return simple;
};

let muralTour, jogTour, barTour;
let token, user;

const guide = {
    name: 'guide',
    email: 'guide@test.com',
    password: 'abc'
};

describe('Tours API', () => {
    beforeEach(() => dropCollection('tours'));
    beforeEach(() => dropCollection('users'));
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
                city: 'Portland',
                tourimage: 'https://picsum.photos/400',
                userid: user.id,
                stops: []
            })
            .then(checkOk)
            .then(({ body }) => muralTour = body);
    });
        
    beforeEach(() => {
        return request
            .post('/api/tours')
            .set('Authorization', token)
            .send({
                name: 'SE Jogging',
                description: 'A great jogging route that ends at a nice fountain',
                userid: user.id,
                city: 'Seattle',
                tourimage: 'https://picsum.photos/300',
                stops: []
            })
            .then(checkOk)
            .then(({ body }) => jogTour = body);
    });
        
    beforeEach(() => {
        return request
            .post('/api/tours')
            .set('Authorization', token)
            .send({
                name: 'NE bars',
                description: 'The best bars in NE Portland.',
                userid: user.id,
                city: 'Portland',
                tourimage: 'https://picsum.photos/500',
                stops: []
            })
            .then(checkOk)
            .then(({ body }) => barTour = body);
    });

    beforeEach(() => {
        return request
            .put(`/api/tours/${muralTour._id}/stops`)
            .set('Authorization', token)
            .send({
                address: '1300 SE Stark St, Portland, OR 97214',
                picture: 'https://picsum.photos/800',
                caption: 'This is where you start the tour! Rev Hall is dope.',
                tourid: muralTour._id
            })
            .then(checkOk)
            .then(({ body }) => muralTour = body);
    });

    beforeEach(() => {
        return request
            .put(`/api/tours/${muralTour._id}/stops`)
            .set('Authorization', token)
            .send({
                address: '923 SE 7th Ave, Portland, OR 97214',
                picture: 'https://picsum.photos/800',
                caption: 'This is where you finish the tour! Go eat some ramen now.',
                tourid: muralTour._id
            })
            .then(checkOk)
            .then(({ body }) => muralTour = body);
    });

    beforeEach(() => {
        return request
            .put(`/api/tours/${jogTour._id}/stops`)
            .set('Authorization', token)
            .send({
                address: '1401 SW Naito Pkwy, Portland, OR 97201',
                picture: 'https://picsum.photos/200',
                caption: 'Start jogging here!',
                tourid: jogTour._id
            })
            .then(checkOk)
            .then(({ body }) => jogTour = body);
    });

    beforeEach(() => {
        return request
            .put(`/api/tours/${jogTour._id}/stops`)
            .set('Authorization', token)
            .send({
                address: '1000 SW Naito Pkwy, Portland, OR 97204',
                picture: 'https://picsum.photos/200',
                caption: 'End jogging here! Now you can cool off in the fountain.',
                tourid: jogTour._id
            })
            .then(checkOk)
            .then(({ body }) => jogTour = body);
    });

    beforeEach(() => {
        return request
            .put(`/api/tours/${barTour._id}/stops`)
            .set('Authorization', token)
            .send({
                address: '1329 NE Fremont St, Portland, OR 97212',
                picture: 'https://picsum.photos/700',
                caption: 'The County Cork has great food and even beter drinks.',
                tourid: barTour._id
            })
            .then(checkOk)
            .then(({ body }) => barTour = body);
    });

    beforeEach(() => {
        return request
            .put(`/api/tours/${barTour._id}/stops`)
            .set('Authorization', token)
            .send({
                address: '1325 NE Fremont St, Portland, OR 97212',
                picture: 'https://picsum.photos/700',
                caption: 'Don\'t need to go too much farther to get to Free House!',
                tourid: barTour._id
            })
            .then(checkOk)
            .then(({ body }) => barTour = body);
    });
    
    it('saves a tour to the database', () => {
        assert.isOk(muralTour._id);
        assert.isOk(jogTour._id);
        assert.isOk(barTour._id);
    });

    it('gets all tours from the database', () => {
        return request
            .get('/api/tours')
            .set('Authorization', token)
            .then(({ body }) => {
                assert.deepEqual(body, [makeSimple(muralTour), makeSimple(jogTour), makeSimple(barTour)]);
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
        jogTour.name = 'SW Jogging';
        return request
            .put(`/api/tours/${jogTour._id}`)
            .set('Authorization', token)
            .send(jogTour)
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body.name, 'SW Jogging');
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
                        assert.equal(body.length, 2);
                        assert.deepEqual(body[0], makeSimple(jogTour));
                    });
            });
    });
});