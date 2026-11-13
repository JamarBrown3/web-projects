// Express calls this before handlers that use an ID parameter.
// Unlike parseInt("3abc"), this rejects an ID that is only partly numeric.
export default function validateId(req, res, next, value) {
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) < 1) {
    return res.status(400).json({ error: "IDs must be positive whole numbers." });
  }
  next();
}
