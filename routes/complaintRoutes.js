const express = require("express");
const router = express.Router();
const complaintController = require("../controller/complaintController");


router.post("/addcomplaint",complaintController.addComplaint)
router.get("/getAllComplaints",complaintController.getAllComplaints)
module.exports = router;
