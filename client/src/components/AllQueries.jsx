import axios from "axios";
import { useEffect, useState } from "react";
import "./AllQueries.css";
import { Link, useNavigate } from "react-router-dom";

export function AllQueries() {
  const [state, setState] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/Allqueries");
      setState(res.data);
    } catch (err) {
      console.error("Error fetching queries:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this query?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/admin/deletequery/${id}`);
      setState((prev) => prev.filter((query) => query._id !== id));
    } catch (err) {
      console.error("Error deleting query:", err);
      alert("Failed to delete query.");
    }
  };

  return (
    <div className="container my-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        Back
      </button>

      <h3 className="text-center mb-4">User Queries</h3>
      <div className="table-responsive">
        <table className="table table-bordered table-hover shadow-sm rounded">
          <thead className="table-primary text-center">
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Mobile No.</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {state.map((data, index) => (
              <tr key={data._id || index}>
                <td>{data.fullName}</td>
                <td>{data.email}</td>
                <td>{data.contact}</td>
                <td className="text-wrap message-cell">{data.message}</td>
                <td className="text-center">
                  <Link
                    className="bi bi-trash bi-sm btn btn-danger"
                    onClick={() => handleDelete(data._id)}
                  ></Link>
                </td>
              </tr>
            ))}
            {state.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No queries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
