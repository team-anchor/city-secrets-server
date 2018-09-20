const router = require('express').Router();
const Auth = require('../models/auth');
const User = require('../models/user');
const { HttpError } = require('../util/errors');
const { sign } = require('../auth/token-service');
const ensureAuth = require('../auth/ensure-auth')();

const getCredentials = body => {
    const { email, name, password } = body;
    delete body.password;
    return { email, name, password };
};

module.exports = router
    .get('/verify', ensureAuth, (req, res) => {
        res.json({ verified: true });
    })

    .post('/signup', ({ body }, res, next) => {
        const { email, name, password } = getCredentials(body);
        return Auth.findOne({ email })
            .countDocuments()
            .then(count => {
                if(count > 0) {
                    throw new HttpError({
                        code: 400,
                        message: 'Email already in use'
                    });
                }
                const auth = new Auth(body);
                const user = new User({ name });
                auth.userid = user._id;
                auth.generateHash(password);

                return Promise.all([auth.save(), user.save()]);
            })
            .then(([auth, user]) => {
                return Promise.all([sign(auth), user]);
            })
            .then(([token, user]) => {
                res.send({ token, user });
            })
            .catch(next);
    })
    
    .post('/signin', ({ body }, res, next) => {
        const { email, password } = body;
        delete body.password;
        let auth;
        return Auth.findOne({ email })
            .then(_auth => {
                auth = _auth;
                if(!auth || !auth.comparePassword(password)) {
                    throw new HttpError({
                        code: 401,
                        message: 'Invalid email or password'
                    });
                }
                const { userid } = auth;
                return User.findById(userid);
            })
            .then(user => {
                return Promise.all([sign(auth), user]);
            })
            .then(([token, user]) => {
                res.send({ token, user });
            })
            .catch(next);
    });