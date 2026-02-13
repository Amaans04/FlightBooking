const express = require("express");
const router = express.Router();
const {
  createFlight,
  getFlights
} = require("../controllers/flightController");

router.post("/", createFlight);
router.get("/", getFlights);

module.exports = router;