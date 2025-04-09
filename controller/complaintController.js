const asyncHandler = require("express-async-handler");
const complaint = require("./../Model/complaintModel");
const appError = require("./../utils/appError");
const sendEmail = require("./../utils/sendEmail");
exports.addComplaint = asyncHandler(async (req, res, next) => {
  const { name, email, message, title } = req.body;
  if (!name || !email || !message || !title) {
    return next(new appError("All fields are required.", 400));
  }
  const newComplaint = await complaint.create({
    name,
    email,
    message,
    title,
  });

  await sendEmail({ email, message, title });

  res.status(201).json({
    status: "success",
    data: newComplaint,
  });
});

exports.getAllComplaints = asyncHandler(async (req, res) => {
  const all = await complaint.find().sort({ date: -1 }); 
  res.status(200).json({
    num:all.length,
    all
  });
});
