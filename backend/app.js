// Import necessary modules and middleware
const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { environment } = require('./config');
const { restoreUser,requireAuth } = require('./utils/auth');
const routes = require('./routes');
const { ValidationError } = require('sequelize');

// Determine if the environment is production
const isProduction = environment === 'production';

// Initialize the express application
const app = express();

// Middleware to log HTTP requests
app.use(morgan('dev'));

// Parse cookies and JSON bodies
app.use(cookieParser());
app.use(express.json());

// Security Middleware
if (!isProduction) {
  // Enable CORS only in development
  app.use(cors());
}

// Helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);

// Restore user based on the JWT in the cookie
app.use(restoreUser);

// Connect all the routes
app.use(routes);

// Catch unhandled requests and forward them to the error handler
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

// Process Sequelize errors
app.use((err, _req, _res, next) => {
  if (err instanceof ValidationError) {
    const errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = 'Validation error';
    err.errors = errors;
  }
  next(err);
});

// Error formatter for all types of errors
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});

// Export the app for use in other files
module.exports = app;
