# Dark Souls II Weapon Archive

A Dark Souls-themed weapon archive. Browse seven weapons and open a detail page for each one, with its image, weapon type, damage type, scaling, description, and location. Built with plain HTML, CSS, and JavaScript, Pico CSS, and a Node.js/Express backend.

[Video walkthrough](https://drive.google.com/file/d/1bMKQ-vpFMAUh2RSK4JbCMZ7kUQ4WtU2V/view?usp=sharing) (recorded with QuickTime Player)

## Features

- Seven weapon cards on the home page, each with at least three details.
- A detail page for every weapon, with all of its data and a browser tab title that matches the weapon.
- A custom 404 page for unknown pages and weapon IDs.
- No frontend framework: plain HTML, CSS, and JavaScript, styled with Pico CSS.
- A dark theme with gold accents, and different backgrounds on the home and 404 pages.
- A shared navigation header that links back to the archive.
- A responsive card grid and a phone-friendly detail page.

## Running the project

From the `dark-souls2-weapons` directory:

```bash
npm ci --prefix client
npm ci --prefix server
npm run build --prefix client
npm start --prefix server
```

Open http://localhost:3001. Only Express needs to stay running for this workflow.
After changing client HTML, CSS, images, or scripts, run
`npm run build --prefix client` again and refresh the browser.
After changing server code, restart Express, or use
`npm run dev --prefix server` to restart it automatically while editing.

### Source files and generated output

`client/` is the single source of truth for frontend code and images.
Vite builds `client/index.html` and copies `client/public/` into `server/public/`.
Express serves that generated directory. Do not edit `server/public/` directly:
the next build replaces it. Generated output is excluded from Git, so a fresh
clone must run the build before starting Express.

`server/server.js`, `server/routes/`, and `server/data/` contain backend source.
Unused Vite starter files have been removed. Vite is only the build tool;
it is not a frontend framework.

For optional Vite development, run `npm run dev --prefix client` alongside
Express and use the address Vite prints (usually port 5173). Its `/weapons`
proxy sends API and weapon-detail requests to Express. Build first, and rebuild
after changing the detail HTML served by Express. Use port 3001 for final
testing, including unknown URLs and the custom 404 response.

### Manual checks

- `/`: seven cards, images, title, and styling.
- `/weapons`: JSON weapon data.
- Every View Details link: matching weapon fields and image, including its ID.
- Navigation back to the homepage.
- `/not-a-real-page` and `/weapons/99999`: custom page with HTTP status 404.
- Narrow browser window: cards and detail content remain usable.

API text is rendered with `textContent` or DOM text nodes instead of HTML
interpolation. Failed data requests display a readable message.

## Notes

Challenges encountered while building this project included:

- Understanding the difference between Vite's development server on port
  5173 and the Express server on port 3001.
- Learning that the frontend must be rebuilt before Express can serve
  updated client files.
- Debugging requests that returned HTML when the JavaScript expected JSON.
- Troubleshooting a 502 error when the development proxy could not obtain
  a valid response from the backend.
- Correcting spelling mistakes in configuration keys, HTML attributes,
  and JavaScript properties.
- Understanding the difference between the script that renders all weapon
  cards and the script that renders one weapon's details.
- Connecting local images and stylesheets using the correct public URLs.
- Testing unknown routes through Express to verify the custom 404 page.

The project currently stores weapon records in a JavaScript array on the
server. It does not yet use a connected database.

I used AI assistance for explanations, debugging guidance, and starter
code while assembling and adapting the project.

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
