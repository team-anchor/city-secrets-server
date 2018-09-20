const mongoose = require('mongoose');
const { RequiredString } = require('./required-types');
const { Schema } = mongoose;

const schema = new Schema({
    name: RequiredString,
    description: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    stops: [
        {
            location: {
                address: RequiredString,
                picture: String,
                caption: String,
                tourId: {
                    type: String,
                    ref: 'Tour',
                    required: true
                }
            }
        }
    ]
});

module.exports = mongoose.model('Tour', schema);