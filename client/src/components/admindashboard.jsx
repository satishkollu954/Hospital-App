import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div className="container mt-5">
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
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered shadow-sm">
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
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => updateStatus(appt._id, "Started")}
                      >
                        Started
                      </button>
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => updateStatus(appt._id, "In Progress")}
                      >
                        In Progress
                      </button>
                      <button
                        className="btn btn-sm btn-outline-success"
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
    </div>
  );
};
