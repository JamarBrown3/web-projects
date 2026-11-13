import express from "express";
import passport from "passport";
import { clientOrigin, sessionCookie } from "../config/runtime.js";

const router = express.Router();

// /auth/login/success route handler to send a success message and the authenticated user object as a JSON response.
router.get("/login/success", (req, res) => {
  if (req.user) {
    return res.status(200).json({ success: true, user: req.user });
  }
  // Logged-out visitors still need a response, otherwise the request hangs
  res.status(200).json({ success: false, user: null });
});
// /auth/login/failed route handler to send a failure message as a JSON response.
router.get("/login/failed", (req, res) => {
  res.status(401).json({ success: false, message: "Login failed" });
});

// /auth/logout route handler to log out the user and redirect them to the home page.
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid", sessionCookie);
      res.json({ status: "logout", user: {} });
    });
  });
});

// /auth/github route handler to initiate the Github authentication process using Passport.js.

router.get(
  "/github",
  passport.authenticate("github", { scope: ["read:user"] }),
);

// /auth/github/callback route handler to handle the callback from Github after authentication and redirect the user to the
//  appropriate page based on the success or failure of the authentication process.

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: `${clientOrigin}/`,
    failureRedirect: `${clientOrigin}/destinations`,
  }),
);

export default router;
