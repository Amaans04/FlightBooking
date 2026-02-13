const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookingsForUser,
} = require("../controllers/bookingController");

// POST /api/bookings
router.post("/", createBooking);

// GET /api/bookings?userId=...
router.get("/", getBookingsForUser);

module.exports = router;

