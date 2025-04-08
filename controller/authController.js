const passport = require("passport");
const asyncHandler = require("express-async-handler");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./../Model/userModel");
const regularUser = require("./../Model/regularUserModel");
const appError = require('./../utils/appError')
// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.ClientID,
      clientSecret: process.env.Clientsecret,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        user = new User({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
        });

        const existingUserByEmail = await User.findOne({
          email: profile.emails[0].value,
        });
        if (existingUserByEmail) {
          return done(null, existingUserByEmail);
        }

        await user.save();
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize User to save in session
passport.serializeUser((user, done) => {
  done(null, user.id); // تخزين الـ ID فقط في السيشن
});

// Deserialize User from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // جلب بيانات المستخدم من الـ DB باستخدام الـ ID
    done(null, user);
  } catch (err) {
    done(err);
  }
});

exports.loginWithGoogle = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
};

exports.googleCallback = (req, res) => {
  res.status(200).json({
    message: `Hello ${req.user.displayName}!`,
  }); // عرض اسم المستخدم بعد تسجيل الدخول
};

exports.signUp = asyncHandler(async (req, res, next) => {
  const user = await regularUser.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });
  res.status(200).json({
    message: "sign up successfully",
    user,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // if the user is not enterd email or password
  if (!email || !password) {
    return next(new appError("please provide email and password"));
  }

  // find the user by the email
  const user = await regularUser.findOne({ email: email }).select("+password");
  if (!user) {
    return next(new appError("no user found with this email", 401));
  }

  // validate password
  const comparePasswords = await user.comparePasswords(password, user.password);
  if (!comparePasswords) {
    return next(new appError("invalid email or password", 401));
  }

  res.status(200).json({
    message: "login success",
    user,
  });
});
