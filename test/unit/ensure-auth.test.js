const { assert } = require('chai');
const createEnsureAuth = require('../../lib/auth/ensure-auth');
const tokenService = require('../../lib/auth/token-service');

describe('Ensure auth middleware', () => {

    const user = { _id: 456 };
    let token = '';
    beforeEach(() => {
        return tokenService.sign(user)
            .then(t => token = t);
    });

    const ensureAuth = createEnsureAuth();

    it('Adds payload as req.auth on success', done => {
        const req = {
            get(header) {
                if(header === 'Authorization') return token;
            }
        };

        const next = () => {
            assert.equal(req.user.id, user._id, 'payload is assigned to req auth');
            done();
        };
        ensureAuth(req, null, next);
    });

});