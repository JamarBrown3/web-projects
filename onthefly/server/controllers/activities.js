import { pool } from "../config/database.js";

const createActivity = async (req, res) => {
  const { activity } = req.body || {};
  if (typeof activity !== "string" || !activity.trim() || activity.trim().length > 100) {
    return res.status(400).json({ error: "Enter an activity between 1 and 100 characters." });
  }
  try {
    // The URL identifies the trip. PostgreSQL supplies id and num_votes.
    const results = await pool.query(
      "INSERT INTO activities (trip_id, activity) VALUES ($1, $2) RETURNING *",
      [req.params.trip_id, activity.trim()],
    );
    res.status(201).json(results.rows[0]);
  } catch (error) {
    if (error.code === "23503") return res.status(404).json({ error: "Trip not found." });
    console.error("Unable to create activity:", error.message);
    res.status(500).json({ error: "Unable to create activity." });
  }
};

const getActivities = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM activities ORDER BY id ASC");
    res.status(200).json(results.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Unable to load activities." });
  }
};

const getTripActivities = async (req, res) => {
  try {
    const results = await pool.query(
      "SELECT * FROM activities WHERE trip_id = $1 ORDER BY id ASC",
      [req.params.trip_id],
    );
    // An empty list means there are no activities matching this trip ID.
    res.status(200).json(results.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Unable to load trip activities." });
  }
};

const updateActivityLikes = async (req, res) => {
  const { num_votes } = req.body || {};
  if (!Number.isInteger(num_votes) || num_votes < 0 || num_votes > 2147483647) {
    return res.status(400).json({ error: "num_votes must be a nonnegative integer within the database integer range." });
  }
  try {
    // The lab calls these likes; the actual database column is num_votes.
    const results = await pool.query(
      "UPDATE activities SET num_votes = $1 WHERE id = $2 RETURNING *",
      [num_votes, req.params.id],
    );
    if (!results.rows.length) return res.status(404).json({ error: "Activity not found." });
    res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Unable to update activity votes." });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const results = await pool.query("DELETE FROM activities WHERE id = $1 RETURNING *", [req.params.id]);
    if (!results.rows.length) return res.status(404).json({ error: "Activity not found." });
    res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Unable to delete activity." });
  }
};

export default { createActivity, getActivities, getTripActivities, updateActivityLikes, deleteActivity };
