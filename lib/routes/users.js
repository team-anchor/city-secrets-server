const router = require('express').Router();
const User = require('../models/user');
const { HttpError } = require('../util/errors');
const ensureAuth = require('../auth/ensure-auth')();

const updateOptions = {
    new: true,
    runValidators: true
};

const make404 = id => new HttpError({
    code: 404,
    message: `No user with id ${id}`
});

module.exports = router

    .post('/', ensureAuth, (req, res, next) => {
        User.create(req.body)
            .then(user => res.json(user))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        User.find()
            .lean()
            .then(users => res.json(users))
            .catch(next);
    })
    
    .get('/:id', (req, res, next) => {
        User.findById(req.params.id)
            .lean()
            .then(user => {
                if(!user) next(make404(req.params.id));
                else res.json(user);
            })
            .catch(next);
    })

    .put('/:id', ensureAuth, (req, res, next) => {
        User.findByIdAndUpdate(
            req.params.id,
            req.body,
            updateOptions
        )
            .then(user => res.json(user))
            .catch(next);       
    });