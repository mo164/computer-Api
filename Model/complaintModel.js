const mongoose = require("mongoose");
const complaintSchema = new mongoose.Schema({
  name: String,
  email: String,
  title: String,
  message: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint