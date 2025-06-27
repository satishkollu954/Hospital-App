import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Dropdown, DropdownButton, ButtonGroup } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import "./AdminDashboard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const [cookie, , removeCookie] = useCookies(["email", "role"]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

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
      .catch((err) => console.error("Error updating status:", err));
  };

  const confirmDelete = (id) => {
    setAppointmentToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = () => {
    axios
      .delete(`http://localhost:5000/admin/appointments/${appointmentToDelete}`)
      .then(() => {
        toast.success("Deleted successfully.");
        setAppointments((prev) =>
          prev.filter((a) => a._id !== appointmentToDelete)
        );
      })
      .catch((err) => {
        console.error("Error deleting:", err);
        toast.error("Failed to delete.");
      })
      .finally(() => {
        setShowDeleteModal(false);
        setAppointmentToDelete(null);
      });
  };

  const handleSignOutClick = () => {
    toast.success("Signed out successfully");
    setTimeout(() => {
      removeCookie("email", { path: "/" });
      removeCookie("role", { path: "/" });
      navigate("/login");
    }, 800);
    // navigate("/adminlogin");
  };

  const offset = currentPage * itemsPerPage;
  const currentAppointments = appointments.slice(offset, offset + itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="admin-dashboard mt-1 px-3">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Admin Dashboard</h2>
        <div className="d-flex justify-content-end mb-3 flex-wrap gap-2">
          <DropdownButton
            as={ButtonGroup}
            title="View All"
            variant="primary"
            className="uniform-dropdown"
            size="sm"
          >
            <Dropdown.Item onClick={() => navigate("/all-doctors")}>
              View All Doctors
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/all-locations")}>
              View All Locations
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/all-diseases")}>
              View All Diseases
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/queries")}>
              View All Queries
            </Dropdown.Item>
          </DropdownButton>

          <DropdownButton
            as={ButtonGroup}
            title="Add"
            variant="primary"
            className="uniform-dropdown"
            size="sm"
          >
            <Dropdown.Item onClick={() => navigate("/add-doctor")}>
              Add Doctor
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/add-location")}>
              Add Location
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/add-disease")}>
              Add Disease
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/faq")}>
              Add FAQ
            </Dropdown.Item>
          </DropdownButton>

          <button className="btn btn-danger" onClick={handleSignOutClick}>
            Logout
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <div className="table-responsive">
          <table className="table table-bordered shadow-sm">
            <thead className="table-light">
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Treatment</th>
                <th>Doctor</th>

                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {currentAppointments.length > 0 ? (
                currentAppointments.map((appt) => (
                  <tr key={appt._id}>
                    <td>{appt.fullName}</td>
                    <td>{appt.email}</td>
                    <td>{appt.phone}</td>
                    <td>{new Date(appt.date).toISOString().split("T")[0]}</td>
                    <td className="reason-cell text-wrap">{appt.reason}</td>
                    <td>{appt.disease}</td>
                    <td>{appt.doctor}</td>

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
                      <div className="d-flex gap-2 flex-wrap justify-content-center">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => updateStatus(appt._id, "Started")}
                        >
                          Start
                        </button>
                        <button
                          className="btn btn-outline-warning btn-sm"
                          onClick={() => updateStatus(appt._id, "In Progress")}
                        >
                          Progress
                        </button>
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => updateStatus(appt._id, "Completed")}
                        >
                          Complete
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => confirmDelete(appt._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        pageCount={Math.ceil(appointments.length / itemsPerPage)}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-center mt-4"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        activeClassName={"active"}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this appointment?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger mt-3"
                  onClick={handleDeleteConfirmed}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
