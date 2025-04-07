const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

mongoose
  .connect(process.env.DB_URL)
  .then((conn) => {
    console.log("Connected to database successfully");
  })
  .catch((err) => {
    console.error(` DB error : ${err}`);
    process.exit(1);
  });

const app = require("./app");

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log("server is running");
});

// HANDLE REJECTION OUT EXPRESS
process.on("unhandledRejection", (err) => {
  console.log(`${err.name} : ${err.message}`);
  console.log("unhandledRejection...shutting down");
  server.close(() => {
    process.exit(1);
  });
});
