import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import ActivityBtn from "../components/ActivityBtn";
import "./TripDetails.css";

const TripDetails = ({ apiURL }) => {
  // The route /trip/get/3 gives us id = "3".
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [travelers, setTravelers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Prevent old responses from updating a page we have left.
    let ignore = false;

    const fetchTrip = async () => {
      const response = await fetch(`${apiURL}/api/trips/${id}`);

      if (!response.ok) {
        throw new Error("Unable to load this trip.");
      }

      const data = await response.json();

      if (!ignore) {
        setTrip(data);
      }
    };

    const fetchActivities = async () => {
      // This endpoint takes the TRIP id, not an activity id.
      const response = await fetch(`${apiURL}/api/activities/${id}`);

      if (!response.ok) {
        throw new Error("Unable to load activities.");
      }

      const data = await response.json();

      if (!ignore) {
        setActivities(data);
      }
    };

    const fetchDestinations = async () => {
      // Your current Express route uses an underscore.
      const response = await fetch(
        `${apiURL}/api/trips_destinations/destinations/${id}`,
      );

      if (!response.ok) {
        throw new Error("Unable to load destinations.");
      }

      const data = await response.json();

      if (!ignore) {
        setDestinations(data);
      }
    };

    const loadPage = async () => {
      setLoading(true);
      setError("");

      try {
        // These requests are independent, so start them together.
        await Promise.all([
          fetchTrip(),
          fetchActivities(),
          fetchDestinations(),
          fetchTravelers(),
        ]);
      } catch (error) {
        if (!ignore) {
          setError(error.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    const fetchTravelers = async () => {
      const response = await fetch(`${apiURL}/api/users-trips/trips/${id}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("👎Unable to load travelers.");
      }

      const data = await response.json();
      if (!ignore) {
        setTravelers(data);
      }
    };

    loadPage();

    return () => {
      ignore = true;
    };
  }, [id, apiURL]);

  if (loading) {
    return <p role="status">Loading trip details...</p>;
  }

  if (error) {
    return (
      <section>
        <p role="alert">{error}</p>
        <Link to="/">Back to Trips</Link>
      </section>
    );
  }

  if (!trip) {
    return <p>Trip not found.</p>;
  }

  return (
    <section>
      <Link to="/">← Back to Trips</Link>

      <h2>{trip.title}</h2>

      <div className="flex-container">
        <div style={{ color: "#222" }}>
          {/* Display travelers for this trip */}
          <div className="travelers">
            {travelers && travelers.length > 0
              ? travelers.map((traveler, index) => (
                  <p
                    key={index}
                    style={{
                      textAlign: "center",
                      lineHeight: 0,
                      paddingTop: 20,
                    }}
                  >
                    {traveler.username}
                  </p>
                ))
              : "No travelers added yet."}
            <br />
            <Link to={"/users/add/" + id}>
              <button className="addActivityBtn">+ Add Traveler</button>
            </Link>
          </div>
          <h3>Trip Information</h3>

          <p>{trip.description}</p>
          <p>Number of days: {trip.num_days}</p>

          {/* PostgreSQL dates may arrive with a time attached. */}
          <p>Start date: {trip.start_date?.slice(0, 10)}</p>
          <p>End date: {trip.end_date?.slice(0, 10)}</p>

          {/* The PostgreSQL MONEY value is already formatted. */}
          <p>Budget: {trip.total_cost}</p>

          <Link to={`/edit/${trip.id}`}>Edit or Delete Trip</Link>

          <h3>Destinations</h3>

          {destinations.length === 0 ? (
            <p>No destinations added yet.</p>
          ) : (
            <ul>
              {destinations.map((destination) => (
                <li key={destination.id}>
                  {destination.destination}
                  {" — "}
                  {destination.city}, {destination.country}
                </li>
              ))}
            </ul>
          )}

          <Link className="addDestinationBtn" to="/destinations">
            + Choose a Destination
          </Link>

          <h3>Activities</h3>

          {activities.length === 0 ? (
            <p>No activities added yet.</p>
          ) : (
            activities.map((activity) => (
              <ActivityBtn
                apiURL={apiURL}
                key={activity.id}
                id={activity.id}
                activity={activity.activity}
                num_votes={activity.num_votes}
              />
            ))
          )}

          <Link className="addActivityBtn" to={`/activity/create/${trip.id}`}>
            + Add Activity
          </Link>
        </div>

        <div className="right-side">
          <img
            src={trip.img_url}
            alt={trip.title}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              margin: "20px auto",
              borderRadius: "12px",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default TripDetails;
