const express = require('express');
const app = express();

//Midlleware
app.use(express.static('public'));
app.use(express.json());

//Routes
const ensureAuth = require('./auth/ensure-auth')();
const auth = require('./routes/auth');

app.use('/api/auth', auth);

const { handler, api404 } = require('./util/errors');

app.use('/api', api404);
app.use((req, res) => {
    res.sendStatus(404);
});
app.use(handler);

module.exports = app;