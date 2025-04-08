const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");

require('dotenv').config();
require('./controller/authController'); 

const app = express();

// session
app.use(
  session({
    secret: process.env.yoursecret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(morgan("dev"));

if (process.env.NODE_ENV === "development") {
  console.log("you are in dev mode🤍🤍");
} else {
  console.log("you are in production mode");
}

app.use(express.json());

// MOUNTING ROUTES
app.use('/auth', authRoutes);
module.exports = app;

