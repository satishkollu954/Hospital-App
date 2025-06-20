import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import { useCookies } from "react-cookie";

export const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const [cookie, setCookie, removeCookie] = useCookies(["email"]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/appointments")
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Error fetching appointments:", err));
  }, []);

  const updateStatus = (id, newStatus) => {
    axios
      .patch(`http://localhost:5000/admin/appointments/${id}`, {
        status: newStatus,
      })
      .then(() => {
        setAppointments((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
        );
      })
      .catch((err) => console.error("Error updating appointment status:", err));
  };

  function handleSignOutClick() {
    removeCookie("email", { path: "/" });
    alert("signed out successfull");
    navigate("/adminlogin");
    // window.location.href = "/adminlogin";
  }

  return (
    <div className="admin-dashboard mt-5 px-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Admin Dashboard</h2>
        <div>
          <button
            className="btn btn-success me-2"
            onClick={() => navigate("/add-location")}
          >
            Add Location
          </button>
          <button
            className="btn btn-warning"
            onClick={() => navigate("/add-doctor")}
          >
            Add Doctors
          </button>
          <button
            className="btn btn-danger ms-2 mb-1"
            onClick={handleSignOutClick}
          >
            Sign out
          </button>
        </div>
      </div>

      <table className="table table-bordered shadow-sm w-100">
        <thead className="table-light">
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((appt) => (
              <tr key={appt._id}>
                <td>{appt.fullName}</td>
                <td>{appt.email}</td>
                <td>{appt.phone}</td>
                <td>{new Date(appt.date).toISOString().split("T")[0]}</td>
                <td>{appt.reason}</td>
                <td>
                  <span
                    className={`badge ${
                      appt.status === "Completed"
                        ? "bg-success"
                        : appt.status === "In Progress"
                        ? "bg-warning"
                        : appt.status === "Started"
                        ? "bg-primary"
                        : "bg-secondary"
                    }`}
                  >
                    {appt.status || "Pending"}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      className="btn btn-outline-primary px-3 py-2 fw-semibold"
                      onClick={() => updateStatus(appt._id, "Started")}
                    >
                      Start
                    </button>
                    <button
                      className="btn btn-outline-warning px-3 py-2 fw-semibold"
                      onClick={() => updateStatus(appt._id, "In Progress")}
                    >
                      Progress
                    </button>
                    <button
                      className="btn btn-outline-success px-3 py-2 fw-semibold"
                      onClick={() => updateStatus(appt._id, "Completed")}
                    >
                      Completed
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
