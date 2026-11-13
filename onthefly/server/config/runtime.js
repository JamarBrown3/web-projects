import "./dotenv.js";

export const isProduction = process.env.NODE_ENV === "production";

export const clientOrigin = new URL(
  process.env.CLIENT_URL || "http://localhost:5173",
).origin;
export const serverOrigin = new URL(
  process.env.SERVER_URL || "http://localhost:3001",
).origin;

if (isProduction && !process.env.SESSION_SECRET) {
  throw new Error("Set SESSION_SECRET before starting the production server.");
}

export const sessionSecret = process.env.SESSION_SECRET || "codepath-local";
export const sessionCookie = {
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
};
