import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import AddTripOptionCard from "../components/AddTripOptionCard";

const AddToTrip = ({ data: trips, apiURL }) => {
  const { destination_id } = useParams();
  const [destination, setDestination] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadDestination = async () => {
      setDestination(null);
      setError("");

      try {
        const response = await fetch(
          `${apiURL}/api/destinations/${destination_id}`,
        );

        if (!response.ok) {
          throw new Error("Unable to load the selected destination.");
        }

        const data = await response.json();

        if (!ignore) {
          setDestination(data);
        }
      } catch (error) {
        if (!ignore) {
          setError(error.message);
        }
      }
    };

    loadDestination();

    return () => {
      ignore = true;
    };
  }, [destination_id, apiURL]);

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!destination) {
    return <p role="status">Loading destination...</p>;
  }

  return (
    <section className="AddToTrip">
      <Link to="/destinations">← Back to Destinations</Link>

      <h2>Add {destination.destination} to a trip</h2>
      <p>Choose an existing trip below.</p>

      {trips.length > 0 ? (
        trips.map((trip) => (
          <AddTripOptionCard
            apiURL={apiURL}
            key={trip.id}
            id={trip.id}
            title={trip.title}
            description={trip.description}
            img_url={trip.img_url}
            destinationName={destination.destination}
          />
        ))
      ) : (
        <p>
          No trips available yet. <Link to="/trip/new">Create a trip</Link>
        </p>
      )}
    </section>
  );
};

export default AddToTrip;
