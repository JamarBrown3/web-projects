import express from "express";
import TripsController from "../controllers/trips.js";

const router = express.Router();

// get all trip route
router.get("/", TripsController.getTrips);

// get a specific route and show the id of the route
router.get("/:id", TripsController.getTrip);

// create a trip
router.post("/", TripsController.createTrip);

// update a trip
router.patch("/:id", TripsController.updateTrip);

// create a delete

router.delete("/:id", TripsController.deleteTrip);

export default router;
