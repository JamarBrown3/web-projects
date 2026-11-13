import express from "express";
import userTrip from "../controllers/users-trips.js";

const { getUserTrips, getTripsUsers, createTripUser } = userTrip;

const router = express.Router();

// Route to get all trips for a specific user
router.get("/user/:username", getUserTrips);

// Route to get all users (travelers) for a specific trip
router.get("/trips/:trip_id", getTripsUsers);

// Route to add a user to a trip
router.post("/create/:trip_id", createTripUser);

export default router;
