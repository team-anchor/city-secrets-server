const { assert } = require('chai');

const getErrors = (validation, number) => {
    assert.isDefined(validation);
    const errors = validation.errors;
    assert.equal(Object.keys(errors).length, number);
    return errors;
};

module.exports = {
    getErrors
};