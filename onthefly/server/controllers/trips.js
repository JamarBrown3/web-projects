import { pool } from "../config/database.js";

//Create a trip
const createTrip = async (req, res) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: "Sign in before creating a trip." });
  }

  let client;
  try {
    const {
      title,
      description,
      img_url,
      num_days,
      start_date,
      end_date,
      total_cost,
    } = req.body;

    client = await pool.connect();
    // Both records belong together. Roll back the trip if membership fails.
    await client.query("BEGIN");
    const results = await client.query(
      `INSERT INTO trips (title, description, img_url, num_days, start_date, end_date, total_cost)
        VALUES($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *`,
      [title, description, img_url, num_days, start_date, end_date, total_cost],
    );

    // Use the authenticated creator, even if the submitted username is changed.
    await client.query(
      "INSERT INTO trips_users (trip_id, user_id) VALUES ($1, $2)",
      [results.rows[0].id, req.user.id],
    );
    await client.query("COMMIT");

    res.status(201).json(results.rows[0]);
    console.log("✅ Successfully created a trip");
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    res.status(409).json({ error: error.message });
  } finally {
    if (client) client.release();
  }
};

// get all trips
const getTrips = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM trips ORDER BY id ASC");
    res.status(200).json(results.rows);
    console.log("✅ Successfully got trips");
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

// get a singular trip
const getTrip = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const results = await pool.query("SELECT * FROM trips WHERE id = $1", [id]);
    res.status(200).json(results.rows[0]);
    console.log("✅ Successfully gotten a trip");
  } catch (error) {
    res.status(409).json({ error: error.message });
    console.log("Unable to get trip");
    console.log("Error:", error.message);
  }
};

const updateTrip = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      title,
      description,
      img_url,
      num_days,
      start_date,
      end_date,
      total_cost,
    } = req.body;

    const results = await pool.query(
      `UPDATE trips
            SET title = $1, description = $2, img_url = $3,
             num_days = $4, start_date = $5, end_date = $6,
             total_cost = $7
             WHERE id = $8
             RETURNING *
             `,
      [
        title,
        description,
        img_url,
        num_days,
        start_date,
        end_date,
        total_cost,
        id,
      ],
    );

    res.status(200).json(results.rows[0]);
    console.log(`✅ ${title} has been updated`);
  } catch (error) {
    res.status(409).json({ error: error.message });
    console.log("⚠️ error logging an update");
  }
};

const deleteTrip = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ error: "Trip ID must be a positive whole number." });
  }
  let client;
  try {
    client = await pool.connect();
    // One transaction: remove dependent records and the trip together.
    // ON UPDATE CASCADE in the schema does not cascade deletions.
    await client.query("BEGIN");
    await client.query("DELETE FROM activities WHERE trip_id = $1", [id]);
    await client.query("DELETE FROM trips_destinations WHERE trip_id = $1", [id]);
    await client.query("DELETE FROM trips_users WHERE trip_id = $1", [id]);
    const results = await client.query("DELETE FROM trips WHERE id = $1 RETURNING *", [id]);
    await client.query("COMMIT");
    if (!results.rows.length) return res.status(404).json({ error: "Trip not found." });
    res.status(200).json(results.rows[0]);
    console.log(`🛑 Deleted Recorded `);
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    res.status(500).json({ error: "Unable to delete trip." });
    console.log(`💀 failed to delete the data`);
  } finally {
    if (client) client.release();
  }
};

export default {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
};
