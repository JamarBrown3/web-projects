import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./CreateActivity.css";

const AddUserToTrip = ({ apiURL }) => {
  const [username, setUsername] = useState({ username: "" });
  const { trip_id } = useParams();

  const addUserToTrip = async (event) => {
    event.preventDefault();

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(username),
    };

    try {
      const response = await fetch(
        `${apiURL}/api/users-trips/create/${trip_id}`,
        options,
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        alert(data.error || "Unable to add user to trip.");
        return;
      }

      // Only redirect once the save has succeeded
      window.location.href = `/trip/get/${trip_id}`;
    } catch (error) {
      console.error(error);
      alert("Unable to reach the server. Is it running?");
    }
  };
  // Function to handle form submission and add a user to a trip
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUsername((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <div>
      <center>
        <h3>Add User to Trip</h3>
      </center>
      <form>
        <label>Enter Github Username:</label> <br />
        <input
          type="text"
          id="username"
          name="username"
          value={username.username}
          onChange={handleChange}
        />
        <br />
        <br />
        <label>Trip ID</label>
        <br />
        <input
          type="number"
          id="trip_id"
          name="trip_id"
          value={trip_id}
          readOnly
        />
        <br />
        <br />
        <button type="submit" value="Submit" onClick={addUserToTrip}>
          Add User to Trip
        </button>
      </form>
    </div>
  );
};

export default AddUserToTrip;
