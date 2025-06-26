import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export function ViewAppointments() {
  const [cookies] = useCookies(["email"]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const decodedEmail = decodeURIComponent(cookies.email);
  console.log("decodedEmail", decodedEmail);

  useEffect(() => {
    if (!decodedEmail) return;

    axios
      .get(
        `http://localhost:5000/admin/appointments/doctor-email/${decodedEmail}`
      )
      .then((res) => {
        setAppointments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);
        setLoading(false);
      });
  }, [decodedEmail]);

  if (loading) {
    return <div className="text-center mt-4">Loading appointments...</div>;
  }

  if (appointments.length === 0) {
    return <div className="text-center mt-4">No appointments found.</div>;
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Your Appointments</h3>

      <div style={{ overflowX: "auto" }}>
        <table
          className="table table-bordered table-hover"
          style={{ minWidth: "900px" }}
        >
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Patient Name</th>
              <th>Patient Email</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Disease</th>
              <th>Status</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt, index) => (
              <tr key={appt._id}>
                <td>{index + 1}</td>
                <td>{appt.fullName}</td>
                <td
                  style={{
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    minWidth: "200px",
                  }}
                >
                  {appt.email}
                </td>
                <td>{appt.phone}</td>
                <td>{new Date(appt.date).toLocaleDateString()}</td>
                <td
                  style={{
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    minWidth: "200px",
                  }}
                >
                  {appt.reason}
                </td>
                <td>{appt.disease}</td>
                <td>{appt.status}</td>
                <td>
                  {appt.state}, {appt.city}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
