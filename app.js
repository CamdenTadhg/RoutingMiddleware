const express = require('express');
const ExpressError = require('./expressError');
const itemRoutes = require('./router');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/items/', itemRoutes);

app.use((req, res, next) => {
    const e = new ExpressError('page not found', 404);
    next(e);
});

app.use((error, req, res, next) => {
    res.status(error.status).json(error.message);
});

module.exports = app;