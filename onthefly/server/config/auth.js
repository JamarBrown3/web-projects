import GitHubStrategy from "passport-github2";
import { pool } from "./database.js";
import { serverOrigin } from "./runtime.js";

const options = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${serverOrigin}/auth/github/callback`,
  state: true,
};

// callback function to verify the user for OAuth 2.0-based strategies.
// The verify callback is called after the user has authenticated with GitHub and is used to verify the user's identity and retrieve their profile information.
const verify = async (accessToken, refreshToken, profile, callback) => {
  const {
    _json: { id, name, login, avatar_url },
  } = profile;

  // Create a user object with the relevant information from the GitHub profile and the access token.
  const userData = {
    githubId: id,
    username: login,
    avatarUrl: avatar_url,
    accessToken,
  };

  try {
    const results = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [userData.username],
    );

    const user = results.rows[0];

    // If the user does not exist in the database, insert a new user record with the relevant information from the GitHub profile and the access token.
    if (!user) {
      const results = await pool.query(
        "INSERT INTO users (githubid, username, avatarurl, accesstoken) VALUES($1, $2, $3, $4) RETURNING *",
        [
          userData.githubId,
          userData.username,
          userData.avatarUrl,
          userData.accessToken,
        ],
      );
      const newUser = results.rows[0];
      return callback(null, newUser);
    }

    return callback(null, user);

    // If the user already exists in the database, return the existing user record.
  } catch (error) {
    console.error("Error extracting user data from GitHub profile:", error);
    return callback(error);
  }
};

export const Github = new GitHubStrategy(options, verify);
