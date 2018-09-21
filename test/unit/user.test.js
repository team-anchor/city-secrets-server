const { assert } = require('chai');
const { Types } = require('mongoose');
const User = require('../../lib/models/user');

describe('User model', () => {
    it('validates a good model', () => {
        const data = {
            name: 'Joe Walker',
            email: 'test@test.com',
            location: 'Portland',
            favorites: [
                {
                    tourid: Types.ObjectId()
                }
            ]
        };

        const user = new User(data);
        const json = user.toJSON();
        delete json._id;
        json.favorites.forEach(f => delete f._id);

        assert.deepEqual(json, data);
    });
}); 