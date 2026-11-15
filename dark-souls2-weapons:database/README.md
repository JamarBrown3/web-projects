# Dark Souls II Weapon Archive (with PostgreSQL)

The second version of the [Dark Souls II weapon archive](../dark-souls2-weapons/). Browse seven weapons, search by name, and open a detail page for each one. The weapons are now stored in a PostgreSQL database hosted on Render and served by a Node.js/Express backend. The frontend is plain HTML, CSS, and JavaScript with Pico CSS.

[Video walkthrough](https://drive.google.com/file/d/1_8uPy7tjRZzYrdUZs6UBrtjceTRLRB25/view?usp=sharing) (recorded with QuickTime Player)

## Features

- Weapon data comes from a Render PostgreSQL database with a `weapons` table.
- Search by weapon name: case-insensitive, matches part of a name, shows a message when nothing matches, and clearing it brings every card back.
- Seven weapon cards, each with its own detail page.
- A custom 404 page for unknown pages and invalid weapon IDs.
- No frontend framework: plain HTML, CSS, and JavaScript, styled with Pico CSS and a custom dark theme.
- Different backgrounds on the home and 404 pages, responsive cards, and a phone-friendly detail page.
- Navigation links back to the archive.

## Notes

This version builds on the first weapon archive by replacing a JavaScript
array with PostgreSQL queries.

The backend uses the pg package to connect to a Render PostgreSQL database.
A setup script creates the weapons table and inserts the initial weapon
records. An Express controller retrieves records from the database and
returns them as JSON. The frontend fetches those records and displays
weapon cards.

The detail route also checks the database to determine whether a weapon
exists before serving its detail page. The page fetches just that record
from GET /weapons/:weaponId/data. Search reads the searchable name stored
on each card, so rearranging cards does not mismatch names and results.

Challenges encountered included:

- Understanding the difference between a database and a table.
- Reusing one Render database for separate gifts and weapons tables.
- Loading environment variables from the correct working directory.
- Understanding default imports and named imports.
- Organizing table creation and insertion code inside the correct functions.
- Replacing references to the old weaponData array in the routes.
- Understanding when to restart Express and when to rebuild the frontend.
- Adding a name search without introducing a frontend framework.

Connection settings are stored in a private server/.env file excluded
from Git. Frontend source files are maintained in client/, while
server/public/ contains generated build output.

Starting the server does not reset or seed the database. The explicit
reset command replaces the weapons table with sample data inside a
transaction, awaiting each insert in order. A failed reset rolls back.

## Running and testing

Keep the existing private connection settings in server/.env. Never
commit this file. The server resolves it relative to its config files,
independently of the terminal's working directory.

1. Build the frontend from client/: run `npm ci`, then `npm run build`.
2. From server/, run `npm ci`.
3. **Database from an earlier version:** run `npm run migrate` once before starting
   this updated version. It renames weapontype to weapon_type without
   deleting records or changing IDs. It is safe to rerun.
4. Run `npm test` from server/. Tests use fake database responses, do not
   load .env files, and never connect to Render. Build the frontend first
   so the HTTP tests can verify the generated HTML and assets.
5. Run `npm start` (or `npm run dev` for automatic restarts).
6. Open http://localhost:3001/ and test search, detail links, and 404s.

**New empty database only:** run `npm run reset` instead of migration to
create and seed the table. **Warning: reset deletes all existing weapons
and replaces them with sample data. Do not use it for a routine startup.**

The database uses weapon_type; the controller explicitly maps it to
weaponType for the frontend. No duplicate field is returned.

Endpoints:

- GET /weapons — array of records as JSON.
- GET /weapons/:weaponId/data — one record as JSON, or JSON 404.
- GET /weapons/:weaponId — detail HTML, or the custom 404 page.
- Unexpected database read failures return HTTP 500.

The automated tests cover routes, error responses, search after card
reordering, detail fetching, and seed commit/rollback behavior. A live
Render connection and the migration still need to be verified locally
using your private settings; mock tests do not validate the live database.

I used AI assistance for explanations, debugging guidance, and code
examples while adapting and testing the project.

## License

Copyright 2026 Jamar Brown

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Game artwork and other third-party assets remain the property of their
respective owners and are not covered by the license for this project's
original code.
