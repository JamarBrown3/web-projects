import { pool } from "../config/database.js";

// Function to add a user to a trip in the trips_users table
const createTripUser = async (req, res) => {
  try {
    const trip_id = parseInt(req.params.trip_id);
    const { username } = req.body;

    // trips_users stores user ids, so look up the user by username first
    const userResult = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username],
    );

    if (userResult.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "User not found. They must log in with GitHub first." });
    }

    const user_id = userResult.rows[0].id;

    const results = await pool.query(
      `INSERT INTO trips_users (trip_id, user_id)
       VALUES ($1, $2)
       RETURNING *`,
      [trip_id, user_id],
    );
    res.status(200).json(results.rows[0]);

    console.log("🆕 added user to trip");
  } catch (error) {
    res.status(409).json({ error: error.message });
    console.log("Error:", error.message);
  }
};

// Function to get all users (travelers) for a specific trip
const getTripsUsers = async (req, res) => {
  try {
    const trip_id = parseInt(req.params.trip_id);
    const results = await pool.query(
      `SELECT u.id, u.username, u.avatarurl
       FROM trips_users tu
       JOIN users u ON tu.user_id = u.id
       WHERE tu.trip_id = $1`,
      [trip_id],
    );

    res.status(200).json(results.rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
    console.log(
      "🚫 unable to GET all users (travelers) - Error:",
      error.message,
    );
  }
};

// Function to get all trips for a specific user
const getUserTrips = async (req, res) => {
  try {
    const username = req.params.username;
    const results = await pool.query(
      `SELECT t.*
       FROM trips_users tu
       JOIN trips t ON tu.trip_id = t.id
       JOIN users u ON tu.user_id = u.id
       WHERE u.username = $1`,
      [username],
    );
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
    console.log("🚫 unable to GET users trips = Error:", error.message);
  }
};

export default { createTripUser, getTripsUsers, getUserTrips };
