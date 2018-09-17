const router = require('express').Router();
const Auth = require('../models/auth');
const { HttpError } = require('../util/errors');
const tokenService = require('../auth/token-service');
const ensureAuth = require('../auth/ensure-auth')();

const getCredentials = body => {
    const { email, password } = body;
    delete body.password;
    return { email, password };
};

module.exports = router
    .get('/verify', ensureAuth, (req, res) => {
        res.json({ verified: true });
    })

    .post('/signup', ({ body }, res, next) => {
        const { email, password } = getCredentials(body);

        Auth.findOne({ email })
            .countDocuments()
            .then(count => {
                if(count > 0) {
                    throw new HttpError({
                        code: 400,
                        message: 'Email already in use'
                    });
                }

                const auth = new Auth(body);
                auth.generateHash(password);
                return auth.save();
            })
            .then(auth => tokenService.sign(auth))
            .then(token => res.json({ token }))
            .catch(next);

    })
    
    .post('/signin', ({ body }, res, next) => {
        const { email, password } = getCredentials(body);

        Auth.findOne({ email })
            .then(auth => {
                if(!auth || !auth.comparePassword(password)) {
                    throw new HttpError({
                        code: 401,
                        message: 'Invalid email or password'
                    });
                }
                return tokenService.sign(auth);
            })
            .then(token => res.json({ token }))
            .catch(next);
    });