# Video Game Store

A full-stack game customizer. Choose a game's genre, setting, platform, player mode, cover image, and cover color, preview it with its price, then save, view, edit, or delete your custom games. Data is stored in a PostgreSQL database hosted on Render and served by a Node.js/Express REST API to a React frontend. This is a demo: prices and compatibility rules are made up, and nothing is for sale.

[Video walkthrough](https://drive.google.com/file/d/1WQXZIV--Gq4v3JTRD5dI8gGbadRC-q5f/view?usp=sharing), including the Render database and the contents of the `games` table.

## Features

- React pages that read from and write to the API, backed by a PostgreSQL `games` table.
- Several features to customize, each with multiple options.
- The price updates as you change options.
- A live preview, including a background that changes with the cover color (Red, Blue, or Green).
- Impossible combinations are blocked: choosing **Handheld** with **Online** shows a warning right away and disables Save until you change it. The server rejects them too.
- The server checks every saved game and calculates the price itself instead of trusting the browser. Shared rules in `shared/gameRules.js` keep the frontend and backend consistent.
- A list of all saved games on the home page, a `/create` page for new ones, and a detail page for each game.
- Edit or delete a game from the list or its detail page, with a confirmation before deleting.
- Loading and error messages on every page that fetches data.

Not built: a game icon that changes with each option you pick.

## Notes

The app has four pages: a home page listing saved games (`/`), a create page (`/create`), a detail page (`/games/:id`), and an edit page (`/edit/:id`). The API supports GET and POST at `/api/games`, and GET, PATCH, and DELETE at `/api/games/:id`. To run it locally, install dependencies with `npm install`, put the Render database settings in a private `server/.env`, run `npm run reset` once on a new database to create and seed the table, and then start everything with `npm run dev`.

Challenges encountered included:

- **A 502 Bad Gateway when saving a new game.** The browser only showed a generic failed request. The real cause was that the Express server was not running behind Vite's proxy (port 3000). I found it by testing the API directly with `curl`, reading the server's terminal output, and restarting with `npm run dev`. The lesson was to find which layer is failing (browser, proxy, server, or database) before changing code.
- **A flipped landing page.** The home route (`/`) loaded the Create Game form instead of the list of games. I moved Create Game to `/create`, made `/` show the list, updated the navigation links, and kept `/games` so the redirects after saving and deleting still work.
- **Understanding how the pieces connect.** Learning how React pages call the services files, which call Express routes, which call controllers, which query PostgreSQL, and what GET, POST, PATCH, and DELETE mean in a REST API.
- Connecting the React forms to the API and matching field names across JavaScript and SQL.
- Fixing navigation paths, handling loading and error states, and keeping text readable against the game-art background.

I used AI assistance (OpenAI Codex, ChatGPT, and Claude) for explanations, debugging guidance, and code examples while adapting and testing the project. Connection settings are stored in a private `server/.env` file that is excluded from Git. Game titles and artwork belong to their respective owners and are used as non-commercial demo content only.

## License

Copyright 2026 Jamar Brown

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
