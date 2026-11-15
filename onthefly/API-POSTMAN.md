# On the Fly: API requests with Postman

Start from the project root with `npm run dev`. All URLs below start with
`http://localhost:3001/api`. Use Postman's method dropdown to select GET, POST,
PATCH, or DELETE. POST/PATCH bodies use **Body > raw > JSON**. GET/DELETE bodies
should be **none**. Save each request separately in your On the Fly collection.

First send `GET /trips` and pick an existing trip ID. In the examples,
`TRIP_ID`, `ACTIVITY_ID`, and `DESTINATION_ID` are placeholders: replace them
with actual numbers returned by the API. They are different kinds of IDs,
even if their numbers happen to match.

## 1. Activities belong to a trip

POST `/activities/TRIP_ID` with:

```json
{ "activity": "Visit an arcade" }
```

Expect 201 and an activity with its own `id`, the `trip_id`, and `num_votes: 0`.
The trip ID comes from `req.params.trip_id`; the name comes from
`req.body.activity`. The foreign key requires the trip to exist.

Then test:

| Method | Path | Result |
| --- | --- | --- |
| GET | `/activities` | All activity records |
| GET | `/activities/TRIP_ID` | Activity records belonging to that trip |
| PATCH | `/activities/ACTIVITY_ID` | Change that activity's vote count |
| DELETE | `/activities/ACTIVITY_ID` | Delete that activity only |

PATCH body:

```json
{ "num_votes": 3 }
```

This sets the count to 3. Sending it twice still leaves 3 votes. It does not
increment the count. The lab says "likes", but the schema calls them `num_votes`.
DELETE the disposable activity only after checking its GET and PATCH behavior.

## 2. Destinations exist independently of trips

POST `/destinations` with:

```json
{
  "destination": "Akihabara Test Destination",
  "description": "A test destination for game shops and arcades.",
  "city": "Tokyo",
  "country": "Japan",
  "img_url": "https://placehold.co/600x400?text=Akihabara",
  "flag_img_url": "https://placehold.co/100x60?text=Japan"
}
```

Expect 201. Record its `id` as DESTINATION_ID.

| Method | Path | Result |
| --- | --- | --- |
| GET | `/destinations` | All destinations |
| GET | `/destinations/DESTINATION_ID` | One destination |
| PATCH | `/destinations/DESTINATION_ID` | Update supplied fields |
| DELETE | `/destinations/DESTINATION_ID` | Delete the destination and its trip connections, keeping trips |

Example PATCH body:

```json
{ "description": "Updated test description for this destination." }
```

Unlike the earlier trip update controller, this destination PATCH accepts
only the fields you want to change. Leave this destination available until
you finish practicing the connections below.

## 3. The join table records membership

POST `/trips_destinations`. Supply your real numeric IDs, for example:

```json
{ "trip_id": 1, "destination_id": 1 }
```

Expect 201. This creates a relationship, not another trip or destination.
Sending the same pair again returns 409 because the combined primary key
prevents duplicate membership. A nonexistent trip or destination returns 404.

| Method | Path | Result |
| --- | --- | --- |
| GET | `/trips_destinations` | All stored pairs of IDs |
| GET | `/trips_destinations/destinations/TRIP_ID` | Full destinations assigned to one trip |
| GET | `/trips_destinations/trips/DESTINATION_ID` | Full trips containing one destination |

These last two queries use INNER JOIN to follow the saved relationship and
return readable records. A relationship list with no matches returns `[]`.

## 4. Cleanup and verification

Delete only the test records you want to remove. Deleting a destination also
removes its connections, but keeps its trips. Deleting a trip removes its
activities, destination memberships, and user memberships, but keeps the
destinations and users themselves. These multi-query deletes use one checked-out
database client and a transaction: all changes commit together or roll back.

After deletion, repeat the relevant GET requests to verify the result.
Malformed URL IDs and invalid request bodies should return 400. Looking up,
editing, or deleting a single missing destination/activity returns 404 where
that individual-record endpoint exists. Unexpected database failures return 500.

## Code map

- `server/server.js` mounts each router under `/api`.
- `server/routes/activities.js` maps activity methods/paths to controller functions.
- `server/controllers/activities.js` reads URL/body values and queries activities.
- `server/routes/destinations.js` and `server/controllers/destinations.js` handle places.
- `server/routes/trips_destinations.js` and its controller handle memberships and joins.
- `server/middleware/validateId.js` rejects invalid URL IDs before controllers run.

Parameterized `$1`, `$2`, etc. placeholders keep submitted values separate from
SQL commands. `RETURNING *` returns the row just inserted, updated, or deleted.
`results.rows` is a list; `results.rows[0]` is the first record in that list.

## Verification performed

29 HTTP checks passed against the actual Express routers/controllers with a
simulated database, covering all 14 added endpoints, input validation, foreign-key
and duplicate errors, joins, transaction query order, rollback, and client release.
These checks do not verify SQL execution on PostgreSQL or the live Render
connection. Complete the Postman workflow above to verify the real database.
No reset or live database changes were performed as part of those checks.
