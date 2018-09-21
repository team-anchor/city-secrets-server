const router = require('express').Router();
const { HttpError } = require('../util/errors');
const Tour = require('../models/tour');
const ensureAuth = require('../auth/ensure-auth')();

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
        // verify(req.headers.authorization)
        //     .then(userObj => {
        //         console.log('*** USER OBJ ***', userObj);
        //     });
        Tour.create(req.body)
            .then(tour => res.json(tour))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Tour.find(req.query)
            .lean()
            .select('-__v')
            .then(tours => res.json(tours))
            .catch(next);
    })

    .get('/city/:search', (req, res, next) => {
        Tour.find({ city: req.params.search })
            .lean()
            .then(tour => res.json(tour))
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
    })

    .put('/:id/stops', (req, res, next) => {
        Tour.findByIdAndUpdate(
            req.params.id,
            req.body,
            updateOptions
        )
            .then(tour => res.json(tour))
            .catch(next);
    })

    .delete('/:id', ensureAuth, (req, res, next) => {
        // console.log('*** REQ USER ID ***', req);
        Tour.findById(req.params.id)
            .lean()
            .then(tour => {
                if(tour.userid.toString() === req.user.id) {
                    Tour.findByIdAndRemove(req.params.id)
                        .lean()
                        .then(tour => res.json({ removed: !!tour }))
                        .catch(next);
                }
                else {
                    next(new HttpError({
                        code: 403,
                        message: 'Invalid user'
                    }));
                }
            });
    });