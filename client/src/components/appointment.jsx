import { useFormik } from "formik";
import "./appointment.css";
import axios from "axios";
import * as yup from "yup";

export function Appointment() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      date: "",
      reason: "",
    },
    validationSchema: yup.object({
      fullName: yup.string().required("Name is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      phone: yup
        .string()
        .required("Mobile is required")
        .matches(/^\d{10}$/, "Invalid mobile number"),
      date: yup
        .date()
        .min(today, "Date cannot be in the past")
        .required("Date is required"),
    }),
    onSubmit: (user, { resetForm }) => {
      axios
        .post("http://localhost:5000/api/appointment", user)
        .then(() => {
          alert("Appointment successful...");
          resetForm();
        })
        .catch(() => {
          alert("Appointment failed. Please try again.");
        });
    },
  });

  return (
    <div className="app-bg">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <h3 className="mb-4">Book an Appointment</h3>
            <form onSubmit={formik.handleSubmit}>
              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label fw-bold">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  placeholder="Enter your name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.fullName}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <p className="text-danger">{formik.errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-danger">{formik.errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="form-label fw-bold">Mobile</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  placeholder="Enter your mobile No"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-danger">{formik.errors.phone}</p>
                )}
              </div>

              {/* Date */}
              <div className="mb-3">
                <label className="form-label fw-bold">Date</label>
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.date}
                  min={new Date().toISOString().split("T")[0]}
                />
                {formik.touched.date && formik.errors.date && (
                  <p className="text-danger">{formik.errors.date}</p>
                )}
              </div>

              {/* Reason */}
              <div className="mb-3">
                <label className="form-label fw-bold">Reason</label>
                <textarea
                  className="form-control"
                  name="reason"
                  rows="3"
                  placeholder="Brief description"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
  );
}
