# On the Fly ✈️

Designed and developed by **Jamar Brown** for CodePath WEB103.

## About

### Description and Purpose

On the Fly is a full-stack travel planner for organizing group trips. Create a trip with dates, a budget, and a cover image, then add destinations, suggest activities, and see who’s coming from the trip details page.

### Inspiration

Group trip plans can get scattered across chats and notes. On the Fly gives travelers one place to collect ideas and upvote the activities they’d like to do.

## Tech Stack

- **Frontend** — React, React Router, Vite, and CSS
- **Backend** — Node.js and Express REST API
- **Database** — PostgreSQL via `pg` (node-postgres)
- **Authentication** — GitHub OAuth via Passport.js and `express-session`

## Features

### 1. Trip Planning

Browse trips and create, edit, or delete trip records. Each trip includes a title, description, cover image, dates, duration, and budget.

### 2. Destination Directory

Browse or create destinations with a description, city, country, photo, and flag image. Add a saved destination to any trip from the directory, and reuse it across multiple trips.

### 3. Activity Ideas and Upvotes

Add activity ideas from a trip’s details page. Upvote an activity to increase its displayed total.

### 4. Traveler Lists

The trip creator is added as the first traveler. Add other travelers by their GitHub usernames after they’ve signed in to On the Fly at least once.

### 5. GitHub Sign-In

Sign in with GitHub to open the trip and destination pages. The app keeps you signed in with a session and displays your GitHub avatar in the navigation.

## Installation Instructions

### Prerequisites

- Node.js 20.19+ in the 20.x series or Node.js 22.12+ and npm
- A PostgreSQL database that accepts SSL connections
- A GitHub account and OAuth app credentials

### 1. Install Dependencies

From the `onthefly` project directory, install dependencies for both the Express server and the React client.

```bash
npm ci
npm --prefix client ci
```

### 2. Configure GitHub OAuth and PostgreSQL

Register a GitHub OAuth app with `http://localhost:5173` as the homepage URL and `http://localhost:3001/auth/github/callback` as the authorization callback URL. [GitHub OAuth app setup](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)

Create `server/.env` and replace the example values with your database credentials and OAuth app credentials. Keep this file out of version control.

```dotenv
PGHOST=your_postgres_host
PGPORT=5432
PGDATABASE=your_database_name
PGUSER=your_database_user
PGPASSWORD=your_database_password

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
SESSION_SECRET=your_random_session_secret

PORT=3001
SERVER_URL=http://localhost:3001
CLIENT_URL=http://localhost:5173
```

### 3. Initialize the Development Database

Point `server/.env` at a dedicated development database before running this command. It drops and recreates the app’s tables, then seeds sample trips from `server/config/data/data.json`.

```bash
npm run reset
```

### 4. Start the App

From `onthefly`, start the API in one terminal.

```bash
npm run dev
```

Start the React client in a second terminal from the same directory.

```bash
npm --prefix client run dev
```

Open [the app](http://localhost:5173) and sign in with GitHub. Vite forwards `/api` and `/auth` requests to Express on port `3001`.

For API request examples, see the [Postman walkthrough](STEP12-POSTMAN.md).
