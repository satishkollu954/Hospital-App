import { Link } from "react-router-dom";

export function DoctorDashboard() {
  return (
    <div>
      <div className="d-flex justify-content-end">
        <Link className="btn btn-primary" to="">
          View Appointments
        </Link>
        <Link className="btn btn-primary ms-3" to="/doctor-profile">
          Profile
        </Link>
        <Link className="btn btn-danger ms-3">Logout</Link>
      </div>
    </div>
  );
}
