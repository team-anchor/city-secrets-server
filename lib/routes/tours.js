const router = require('express').Router();
const { HttpError } = require('../util/errors');
const Tour = require('../models/tour');

const updateOptions = {
    new: true,
    runValidators: true
};

const make404 = id => new HttpError({
    code: 404,
    message: `no tour with id ${id}`
});

module.exports = router
    .post('/', (req, res, next) => {
        Tour.create(req.body)
            .then(tour => res.json(tour))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Tour.find(req.query)
            .lean()
            .select('name description userId')
            .then(tours => res.json(tours))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Tour.findById(req.params.id)
            .lean()
            .select('-__v')
            .then(tour => {
                if(!tour) next(make404(req.params.id));
                else res.json(tour);
            })
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Tour.findByIdAndUpdate(
            req.params.id,
            req.body,
            updateOptions
        )
            .then(tour => res.json(tour))
            .catch(next);
    });