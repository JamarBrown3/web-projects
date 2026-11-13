import express from "express";
import ActivitiesController from "../controllers/activities.js";
import validateId from "../middleware/validateId.js";

const router = express.Router();
router.param("trip_id", validateId);
router.param("id", validateId);

router.get("/", ActivitiesController.getActivities);
// Following the lab: GET/POST use a TRIP id; PATCH/DELETE use an ACTIVITY id.
router.get("/:trip_id", ActivitiesController.getTripActivities);
router.post("/:trip_id", ActivitiesController.createActivity);
router.patch("/:id", ActivitiesController.updateActivityLikes);
router.delete("/:id", ActivitiesController.deleteActivity);

export default router;
