const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.Admin_Email,
      pass: process.env.Admin_Password,
    },
  });

  const mailOpts = {
    from: process.env.Admin_Email,
    to: options.email,
    subject: options.title,
    text: options.message,
  };

  try {
    await transporter.sendMail(mailOpts);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
