import express from "express";
import DestinationsController from "../controllers/destinations.js";
import validateId from "../middleware/validateId.js";

const router = express.Router();
router.param("id", validateId);
router.get("/", DestinationsController.getDestinations);
router.get("/:id", DestinationsController.getDestination);
router.post("/", DestinationsController.createDestination);
router.patch("/:id", DestinationsController.updateDestination);
router.delete("/:id", DestinationsController.deleteDestination);

export default router;
