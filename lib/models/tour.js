const mongoose = require('mongoose');
const { RequiredString } = require('./required-types');
const { Schema } = mongoose;

const schema = new Schema({
    name: RequiredString,
    description: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stops: [
        {
            location: {
                address: RequiredString,
                picture: String,
                caption: String
            }
        }
    ]
});

module.exports = mongoose.model('Tour', schema);