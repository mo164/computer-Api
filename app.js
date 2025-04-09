const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes")
 const globalErrorHandling = require("./utils/globalErrorHandling");
 const appError = require("./utils/appError");
require("dotenv").config();
require("./controller/authController");

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
app.use("/auth", authRoutes);
app.use("/complaints",complaintRoutes)
// app.all("*", (req, res, next) => {
//   next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
// });
// // GLOBAL ERROR HANDLING MIDDLEWARE FOR EXPRESS
 app.use(globalErrorHandling);

module.exports = app;
