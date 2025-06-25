import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import axios from "axios";

export function DoctorDashboard() {
  const [cookies, , removeCookies] = useCookies(["email"]);
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);

  const decodedEmail = decodeURIComponent(cookies.email);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/admin/doctor/${decodedEmail}`)
      .then((res) => setDoctor(res.data))
      .catch((err) => console.error("Failed to load doctor info", err));
  }, [decodedEmail]);

  function handleLogoutClick() {
    removeCookies("email");
    navigate("/login");
  }

  return (
    <div className="container mt-4">
      {/* Top Buttons */}
      <div className="d-flex justify-content-end mb-3">
        <Link className="btn btn-primary" to="/doctor/appointments">
          View Appointments
        </Link>
        <Link className="btn btn-primary ms-3" to="/doctor-profile">
          Profile
        </Link>
        <button onClick={handleLogoutClick} className="btn btn-danger ms-3">
          Logout
        </button>
      </div>

      {/* Greeting */}
      <h2 className="mb-4">Welcome, {doctor?.Name || "Doctor"}!</h2>

      {/* Overview Cards */}
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card shadow text-center p-3">
            <h5>Total Appointments</h5>
            <h2>--</h2> {/* Replace with actual count if available */}
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow text-center p-3">
            <h5>Availability</h5>
            <span
              className={`badge ${
                doctor?.Availability ? "bg-success" : "bg-secondary"
              }`}
            >
              {doctor?.Availability ? "Available" : "Not Available"}
            </span>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow text-center p-3">
            <h5>Working Hours</h5>
            <p>
              {doctor?.From || "--"} to {doctor?.To || "--"}
            </p>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-4 p-4 bg-light rounded shadow-sm">
        <p>
          This is your personal space to manage appointments, view and update
          your profile, and check your working schedule. Stay connected with
          your patients and manage your availability.
        </p>
      </div>
    </div>
  );
}
