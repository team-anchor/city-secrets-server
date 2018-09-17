const mongoose = require('mongoose');
const { RequiredString } = require('./required-types');
const { Schema } = mongoose;

const schema = new Schema({
    name: RequiredString,
    email: String,
    location: RequiredString,
    favorites: [
        { tourId: {
            type: Schema.Types.ObjectId,
            ref: 'Tour',
        } }]
});

module.exports = mongoose.model('User', schema);