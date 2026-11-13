import "./App.css";
import { useState, useEffect } from "react";
import { Link, useRoutes } from "react-router";
import ReadTrips from "./pages/ReadTrips";
import CreateTrip from "./pages/CreateTrip";
import EditTrip from "./pages/EditTrip";
import CreateDestination from "./pages/CreateDestination";
import ReadDestinations from "./pages/ReadDestinations";
import TripDetails from "./pages/TripDetails";
import CreateActivity from "./pages/CreateActivity";
import AddToTrip from "./pages/AddToTrip";
import Login from "./pages/login";
import Avatar from "./components/Avatar";
import AddUserToTrip from "./pages/AddUserToTrip";

const API_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "")
  : "";

const App = () => {
  // State to hold trips and destinations
  const [trips, setTrips] = useState([]);
  const [destinations, setDestinations] = useState([]);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      const response = await fetch(`${API_URL}/api/trips`);

      const data = await response.json();
      setTrips(data);
    };

    const fetchDestinations = async () => {
      const response = await fetch(`${API_URL}/api/destinations`);
      const data = await response.json();

      setDestinations(data);
    };

    // Fetch user data from the backend
    const getUser = async () => {
      const response = await fetch(`${API_URL}/auth/login/success`, {
        // credentials: "include" allows cookies to be sent with the request
        credentials: "include",
      });
      const json = await response.json();
      setUser(json.user);
    };

    fetchTrips();
    fetchDestinations();
    getUser();
  }, []);

  // Function to handle user logout
  const logout = async () => {
    const url = `${API_URL}/auth/logout`;
    const response = await fetch(url, { credentials: "include" });
    await response.json();
    window.location.href = "/";
  };

  // Sets up routes
  let element = useRoutes([
    {
      path: "/",
      element:
        user && user.id ? (
          <ReadTrips user={user} data={trips} />
        ) : (
          <Login apiURL={API_URL} />
        ),
    },
    {
      path: "/trip/new",
      element:
        user && user.id ? (
          <CreateTrip user={user} apiURL={API_URL} />
        ) : (
          <Login apiURL={API_URL} />
        ),
    },
    {
      path: "/edit/:id",
      element:
        user && user.id ? (
          <EditTrip data={trips} apiURL={API_URL} />
        ) : (
          <Login apiURL={API_URL} />
        ),
    },
    {
      path: "/destinations",
      element:
        user && user.id ? (
          <ReadDestinations data={destinations} />
        ) : (
          <Login apiURL={API_URL} />
        ),
    },
    {
      path: "/trip/get/:id",
      element:
        user && user.id ? (
          <TripDetails apiURL={API_URL} />
        ) : (
          <Login apiURL={API_URL} />
        ),
    },
    {
      path: "/destination/new",
      element:
        user && user.id ? (
          <CreateDestination apiURL={API_URL} />
        ) : (
          <Login apiURL={API_URL} />
        ),
    },
    {
      path: "/activity/create/:trip_id",
      element:
        user && user.id ? (
          <CreateActivity apiURL={API_URL} />
        ) : (
          <Login apiURL={API_URL} />
        ),
    },
    {
      path: "/destinations/add/:destination_id",
      element:
        user && user.id ? (
          <AddToTrip data={trips} apiURL={API_URL} />
        ) : (
          <Login apiURL={API_URL} />
        ),
    },
    {
      path: "/users/add/:trip_id",
      element:
        user && user.id ? (
          <AddUserToTrip apiURL={API_URL} />
        ) : (
          <Login apiURL={API_URL} />
        ),
    },
  ]);

  return (
    <div className="App">
      {user && user.id ? (
        <div className="header">
          <h1>On The Fly ✈️</h1>
          <Link to="/">
            <button className="headerBtn">Explore Trips</button>
          </Link>
          <Link to="/destinations">
            <button className="headerBtn">Explore Destinations</button>
          </Link>
          <Link to="/trip/new">
            <button className="headerBtn"> + Add Trip </button>
          </Link>
          <Link to="/destination/new">
            <button className="headerBtn"> + Add Destination </button>
          </Link>
          <button onClick={logout} className="headerBtn">
            Logout
          </button>
          <Avatar className="avatar" user={user} />
        </div>
      ) : (
        <></>
      )}
      {element}
    </div>
  );
};

export default App;
