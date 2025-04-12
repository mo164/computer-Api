const mongoose = require("mongoose");
const validator = require("validator");
 const slugify = require("slugify");
const bcrypt = require("bcrypt");

const regularUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Too short password"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

// Hash password before saving
regularUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Password comparison function
regularUserSchema.methods.comparePasswords = async function (
  enteredPassword,
  hashedPassword
) {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};
regularUserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};
const regularUser = mongoose.model("regularUser", regularUserSchema);

module.exports = regularUser;
