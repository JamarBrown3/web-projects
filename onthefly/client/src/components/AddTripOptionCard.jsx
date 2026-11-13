import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import "./Card.css";

const AddTripOptionCard = (props) => {
  const { destination_id } = useParams();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addToTrip = async () => {
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`${props.apiURL}/api/trips_destinations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trip_id: Number(props.id),
          destination_id: Number(destination_id),
        }),
      });

      if (!response.ok) {
        const data = await response.json();

        throw new Error(data.error || "Unable to add this destination.");
      }

      // Show the trip where the destination was just added.
      navigate(`/trip/get/${props.id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <article
      className="Card"
      style={{
        backgroundImage: `url(${props.img_url})`,
        height: "auto",
        minHeight: "280px",
      }}
    >
      <div className="card-info">
        <h2 className="title">{props.title}</h2>
        <p className="description">{props.description}</p>

        {error && <p role="alert">{error}</p>}

        <button className="addToTrip" onClick={addToTrip} disabled={saving}>
          {saving ? "Adding..." : `Add ${props.destinationName} to this trip`}
        </button>
      </div>
    </article>
  );
};

export default AddTripOptionCard;
