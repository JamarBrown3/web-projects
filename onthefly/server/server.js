import express from "express";
import cors from "cors";
import tripRoutes from "./routes/trips.js";
import activityRoutes from "./routes/activities.js";
import destinationRoutes from "./routes/destinations.js";
import tripDestinationRoutes from "./routes/trips_destinations.js";
import passport from "passport";
import session from "express-session";
import { Github } from "./config/auth.js";
import authRoutes from "./routes/auth.js";
import { clientOrigin, isProduction, sessionCookie, sessionSecret } from "./config/runtime.js";
import userTripRoutes from "./routes/users-trips.js";

// create express app
const app = express();
if (isProduction) app.set("trust proxy", 1);

// middleware to parse JSON data from HTTP request
app.use(express.json());

// cors middleware layer to enable to cross origin request

app.use(
  cors({
    origin: clientOrigin,
    methods: "GET, POST, PUT, PATCH, DELETE",
    credentials: true,
  }),
);

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: sessionCookie,
  }),
);

// initialize passport and session middleware
app.use(passport.initialize()); // initialize passport middleware
app.use(passport.session()); // initialize session middleware

passport.use(Github); // use the GitHub strategy for authentication

// serialize the user to the session
passport.serializeUser((user, done) => {
  // Only store the fields the app needs, so the GitHub access token never ends up in the session
  const sessionUser = {
    id: user.id,
    username: user.username,
    avatarurl: user.avatarurl,
  };
  done(null, sessionUser);
});

// deserialize the user from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use("/auth", authRoutes); // use the auth routes for authentication

// Creat a router handler for GET request at / that responds with a status
//  code 200 and an h1 element containing the text ✈️ On the Fly API

app.use("/api/users-trips", userTripRoutes); // use the user-trip routes for user-trip related operations

app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      '<h1 style="text-align: center; marign-top: 50px;">✈️ On the Fly API</h1>',
    );
});

app.use("/api/trips", tripRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/trips_destinations", tripDestinationRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
