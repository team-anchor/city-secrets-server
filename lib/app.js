const express = require('express');
const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Routes
const ensureAuth = require('./auth/ensure-auth')();
const auth = require('./routes/auth');
const tour = require('./routes/tours');

app.use('/api/auth', auth);
app.use('/api/tours', ensureAuth, tour);

const { handler, api404 } = require('./util/errors');

app.use('/api', api404);
app.use((req, res) => {
    res.sendStatus(404);
});
app.use(handler);

module.exports = app;