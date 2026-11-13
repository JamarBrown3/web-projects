import express from "express";
import TripsDestinationsController from "../controllers/trips_destinations.js";
import validateId from "../middleware/validateId.js";

const router = express.Router();
router.param("destination_id", validateId);
router.param("trip_id", validateId);
router.get("/", TripsDestinationsController.getTripsDestinations);
router.post("/", TripsDestinationsController.createTripDestination);
router.get("/trips/:destination_id", TripsDestinationsController.getAllTrips);
router.get("/destinations/:trip_id", TripsDestinationsController.getAllDestinations);

export default router;
