const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());

// const ensureAuth = require('./auth/ensure-auth')();
// const profiles = require('./routes/profiles');
const auth = require('./routes/auth');

app.use('/api/auth', auth);
// app.use('/api/reviewers', ensureAuth, profiles);

module.exports = app;