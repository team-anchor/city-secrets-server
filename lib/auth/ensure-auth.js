const tokenService = require('./token-service');
// const { HttpError } = require('../util/errors');

module.exports = function createEnsureAuth() {
    return (req, res, next) => {
        const token = req.get('Authorization');
        try {
            if(!token) return next ({ status: 400, error: 'No token found' });
            const payload = tokenService.verify(token);
            req.user = payload;
            next();
        }
        catch(err) {
            next({
                status: 401,
                error: 'Invalid token'
            });
        }
    };
};