const { assert } = require('chai');
const { Types } = require('mongoose');
const Tour = require('../../lib/models/tour');

describe('Tour model', () => {
    it('validates a good model', () => {
        const data = {
            name: 'SE Murals',
            description: 'The best murals in SE PDX',
            city: 'Portland',
            tourimage: 'www.stockimage.com',
            userid: Types.ObjectId(),
            stops: [
                {
                    address: '1300 SE Stark St, Portland OR, 97214',
                    picture: 'https://www.randomimage.com',
                    caption: 'This is where you start the tour!'
                },
                {
                    address: '923 SE 7th Ave, Portland OR 97214',
                    picture: 'https://www.randomimage.com',
                    caption: 'This is where you finish the tour!'
                }
            ]
        };

        const tour = new Tour(data);
        const json = tour.toJSON();
        delete json._id;
        json.stops.forEach(s => delete s._id);

        assert.deepEqual(json, data);
    });
});