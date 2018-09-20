const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('./required-types');
const bcrypt = require('bcryptjs');

const schema = new Schema({
    name: RequiredString,
    email: RequiredString,
    hash: RequiredString,
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    roles: [String]
});

schema.methods.generateHash = function(password) {
    this.hash = bcrypt.hashSync(password, 8);
};

schema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.hash);
};

module.exports = mongoose.model('Auth', schema);