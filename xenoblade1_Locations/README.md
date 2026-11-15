# Xenoblade Community Space

A Xenoblade Chronicles-themed community space. Explore five in-game locations (Gaur Plain, Eryth Sea, Bionis' Interior, Mechonis Field, and Fallen Arm) and find community events for each one, like exploration walks, screenshot challenges, and strategy meetups. Location and event data is stored in a PostgreSQL database hosted on Render, served by a Node.js/Express API, and displayed with React.

[Video walkthrough](https://drive.google.com/file/d/1W8arqzMSffwSMcJQIYtvSOabs71CW5mB/view?usp=sharing) (recorded with QuickTime Player), including the Render database and the contents of the `events` table.

## Features

- React pages that read from the API, backed by PostgreSQL `locations` and `events` tables.
- A visual picker for the five locations, each with its own page and URL listing its events.
- An All Events page with a location dropdown filter, and a message when a location has no events.
- Each event card shows its location's image and name.
- A live countdown on every event, updated every second.
- Past events are grayed out, crossed out, and marked "This event has passed." The sample data includes one past event (Gaur Plain Sunrise Meetup) so you can see it right away.
- Loading and error messages while data is fetched.
- A shared banner with the site title and Home and Events buttons that stacks on small screens.
- Dark, left-aligned event cards with consistent image sizes, a custom background, a stylized red title, and a browser tab title.

## Notes

The backend connects to a Render PostgreSQL database with the `pg` package. A reset script (`npm run reset`) creates the locations and events tables and seeds them with sample data. Express controllers read from those tables, and routes expose them as JSON at `/api`. The React frontend calls the API through small service files (`EventsAPI` and `LocationsAPI`) and renders the results.

The All Events page loads every event and location, then filters events in React state based on the location dropdown. Each event card receives its location's name and image by matching `location_id` to the location's database ID. The countdown is its own component that recalculates the time remaining every second and shows a "passed" message once the start time is behind the current time.

Challenges encountered included:

- **Mixing up `Event.jsx` and `Events.jsx`.** The card component (`Event.jsx`) and the all-events page (`Events.jsx`) have almost the same name. I fixed the card first, so the location pages worked, but the banner's Events button still showed placeholder text because `Events.jsx` had never been connected to the API. I had to slow down and fix them one at a time.
- **Header and navigation layout.** My oversized title took up the whole row and pushed the Home and Events buttons underneath it. I fixed it with a shared dark banner, title on the left and buttons on the right, that stacks on small screens.
- **CSS specificity.** A global `#root h1` rule made every heading huge, so the banner title needed a more specific selector. The first fix also swapped out my stylized font for readability, so I put the Rock Salt font back and picked a red title with a subtle glow to match the Xenoblade look.
- **Styling the all-events page.** The cards started out unbalanced and hard to read. I gave them dark backgrounds, left-aligned text, a location image and name on every card, and consistent image sizes. I also removed fixed-height styling that made the text overlap.
- **A stray `margin-left`.** An image was pushed out of place by a `margin-left` in the starter CSS, which turned out to be a box model issue.
- **Location filter state.** The dropdown value is always a string, but `location_id` is a number, so the filter did not match until I compared them as strings. I also had the dropdown in place but forgot to define the state and to map over the filtered list instead of the full list.
- **Dates, countdown, and past events.** The countdown and past-event styling depend on `starts_at` being a real timestamp. To demonstrate the passed-event formatting, I added a past event (Gaur Plain Sunrise Meetup) to the seed data and reran `npm run reset`, which brought the total to 11 events.
- **Vite image path warning.** I referenced a background image as `/public/images/...`, but Vite serves the `public` folder from the root, so the path needed to be `/images/...`.
- **Reviewing AI suggestions.** Some editor suggestions, like Copilot wanting to delete the event image tag, were wrong, so I checked each one against what the page actually needed before accepting it.

Connection settings are stored in a private `server/.env` file that is excluded from Git.

I used AI assistance (ChatGPT, Claude, and GitHub Copilot) for explanations, debugging guidance, and code examples while adapting and testing the project.

## License

Copyright 2026 Jamar Brown

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Game artwork and other third-party assets remain the property of their
respective owners and are not covered by the license for this project's
original code.
