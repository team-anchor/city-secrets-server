const { assert } = require('chai');
const { Types } = require('mongoose');
const { save } = require('./request');
const { dropCollection } = require('./db');

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

describe('Tours API', () => {
    beforeEach(() => dropCollection('tours'));
    beforeEach(() => dropCollection('users'));

    beforeEach(() => save('tours', mural).then(data => muralTour = data));
    beforeEach(() => save('tours', jog).then(data => jogTour = data));

    it('saves a tour to the database', () => {
        assert.isOk(muralTour._id);
        assert.isOk(jogTour._id);
    });
});