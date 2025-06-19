import { useFormik } from "formik";
import "./appointment.css";

export function Appointment() {
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      date: "",
      reason: "",
    },
    onSubmit: (user) => {
      console.log(user);
    },
  });

  return (
    <div className="container my-5">
      <div className="row align-items-center">
        <div className="col-md-6 mb-4 mb-md-0">
          <h3 className="mb-4">Book an Appointment</h3>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
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
              <label className="form-label">Email</label>
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
              <label className="form-label">Mobile</label>
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
              <label className="form-label">Date</label>
              <input
                type="date"
                name="date"
                className="form-control"
                onChange={formik.handleChange}
                value={formik.values.date}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Reason</label>
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
            src="appointment-logo.png"
            alt="Appointment"
            className="img-fluid rounded shadow"
            style={{ maxHeight: "450px" }}
          />
        </div>
      </div>
    </div>
  );
}
