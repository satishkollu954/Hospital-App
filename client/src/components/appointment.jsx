import { useFormik } from "formik";
import "./appointment.css";
import axios from "axios";

export function Appointment() {
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      date: "",
      reason: "",
    },
    onSubmit: (user, { resetForm }) => {
      axios
        .post("http://localhost:5000/api/appointment", user)
        .then(() => {
          alert("Appointment successful...");
          resetForm();
        })
        .catch((error) => {
          alert("Appointment failed. Please try again.");
        });
    },
  });

  return (
    <div className="app-bg">
      <div>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <h3 className="mb-4">Book an Appointment</h3>
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    placeholder="Enter your name"
                    onChange={formik.handleChange}
                    value={formik.values.fullName}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Mobile</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    placeholder="Enter your mobile No"
                    onChange={formik.handleChange}
                    value={formik.values.phone}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Date</label>
                  <input
                    type="date"
                    name="date"
                    className="form-control"
                    onChange={formik.handleChange}
                    value={formik.values.date}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Reason</label>
                  <textarea
                    className="form-control"
                    name="reason"
                    rows="3"
                    placeholder="Brief description"
                    onChange={formik.handleChange}
                    value={formik.values.reason}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Submit
                </button>
              </form>
            </div>

            <div className="col-md-6 text-center">
              <img
                src="app-logo.jpg"
                alt="Appointment"
                className="img-fluid rounded shadow"
                style={{ maxHeight: "400px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
