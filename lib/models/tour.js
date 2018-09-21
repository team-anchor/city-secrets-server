const mongoose = require('mongoose');
const { RequiredString } = require('./required-types');
const { Schema } = mongoose;

const schema = new Schema({
    name: RequiredString,
    description: String,
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    city: String,
    tourimage: String,
    stops: [
        {
            address: RequiredString,
            picture: String,
            caption: String,
            tourid: {
                type: String,
                ref: 'Tour',
                required: true
            }
        }
    ]
});

module.exports = mongoose.model('Tour', schema);