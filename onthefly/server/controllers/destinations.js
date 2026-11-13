import { pool } from "../config/database.js";

// These limits match the columns in reset.js.
const fields = ["destination", "description", "city", "country", "img_url", "flag_img_url"];
const limits = [100, 500, 100, 100, Infinity, Infinity];
const validField = (field, value) => typeof value === "string" && value.trim().length > 0
  && value.trim().length <= limits[fields.indexOf(field)];

const createDestination = async (req, res) => {
  const body = req.body || {};
  if (!fields.every((field) => validField(field, body[field]))) {
    return res.status(400).json({ error: "Supply destination, description, city, country, img_url, and flag_img_url within their column limits." });
  }
  try {
    const results = await pool.query(
      `INSERT INTO destinations (destination, description, city, country, img_url, flag_img_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      fields.map((field) => body[field].trim()),
    );
    res.status(201).json(results.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Unable to create destination." });
  }
};

const getDestinations = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM destinations ORDER BY id ASC");
    res.status(200).json(results.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Unable to load destinations." });
  }
};

const getDestination = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM destinations WHERE id = $1", [req.params.id]);
    if (!results.rows.length) return res.status(404).json({ error: "Destination not found." });
    res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Unable to load destination." });
  }
};

const updateDestination = async (req, res) => {
  const body = req.body || {};
  const changed = fields.filter((field) => Object.hasOwn(body, field));
  if (!changed.length || !changed.every((field) => validField(field, body[field]))) {
    return res.status(400).json({ error: "Supply at least one valid destination field to update." });
  }
  try {
    // Only allow column names from our fixed fields list. Values still use $ placeholders.
    // This PATCH accepts just the fields the caller wants to change.
    const assignments = changed.map((field, index) => `${field} = $${index + 1}`).join(", ");
    const values = changed.map((field) => body[field].trim());
    values.push(req.params.id);
    const results = await pool.query(
      `UPDATE destinations SET ${assignments} WHERE id = $${values.length} RETURNING *`, values,
    );
    if (!results.rows.length) return res.status(404).json({ error: "Destination not found." });
    res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Unable to update destination." });
  }
};

const deleteDestination = async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    // Remove memberships first, keeping the trips themselves.
    await client.query("DELETE FROM trips_destinations WHERE destination_id = $1", [req.params.id]);
    const results = await client.query("DELETE FROM destinations WHERE id = $1 RETURNING *", [req.params.id]);
    await client.query("COMMIT");
    if (!results.rows.length) return res.status(404).json({ error: "Destination not found." });
    res.status(200).json(results.rows[0]);
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    console.error(error.message);
    res.status(500).json({ error: "Unable to delete destination." });
  } finally {
    if (client) client.release();
  }
};

export default { createDestination, getDestinations, getDestination, updateDestination, deleteDestination };
