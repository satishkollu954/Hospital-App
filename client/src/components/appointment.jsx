import { useFormik } from "formik";
import "./appointment.css";
import axios from "axios";
import * as yup from "yup";
import { useEffect, useState } from "react";

export function Appointment() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [otpVisible, setOtpVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [doctors, setDoctors] = useState([]);

  const [states, setStates] = useState([]);
  const [city, setCities] = useState([]);

  const [diseases, setDiseases] = useState([]);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      disease: "",
      state: "",
      city: "",
      date: "",
      doctor: "",
      time: "",
      reason: "",
    },
    validationSchema: yup.object({
      fullName: yup.string().required("Name is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      phone: yup
        .string()
        .required("Mobile is required")
        .matches(/^\d{10}$/, "Invalid mobile number"),
      state: yup.string().required("State is required"),
      city: yup.string().required("City is required"),
      disease: yup.string().required("Disease is required"),
      doctor: yup.string().required("Doctor is required"),
      date: yup
        .date()
        .min(today, "Date cannot be in the past")
        .required("Date is required"),
    }),
    onSubmit: (user, { resetForm }) => {
      if (!emailVerified) {
        alert("Please verify your email before submitting.");
        return;
      }

      axios
        .post("http://localhost:5000/api/appointment", user)
        .then(() => {
          alert("Appointment successful...");
          resetForm();
          setEmailVerified(false);
          setOtpVisible(false);
          setOtp("");
        })
        .catch(() => {
          alert("Appointment failed. Please try again.");
        });
    },
  });

  useEffect(() => {
    if (formik.values.city && formik.values.disease) {
      axios
        .get("http://localhost:5000/doctor/finddoctors", {
          params: {
            city: formik.values.city,
            Specialization: formik.values.disease,
          },
        })
        .then((res) => {
          const result = res.data.doctors || res.data || [];
          setDoctors(result);
          console.log("entered inside", result);
        })

        .catch(() => setDoctors([]));
    } else {
      setDoctors([]);
    }
  }, [formik.values.city, formik.values.disease]);

  useEffect(() => {
    if (formik.values.doctor) {
      const selectedDoctor = doctors.find(
        (doc) => doc.Name === formik.values.doctor
      );
      if (selectedDoctor) {
        const from = selectedDoctor.From || "";
        const to = selectedDoctor.To || "";
        const timeRange = from && to ? `${from} - ${to}` : "";
        if (selectedDoctor.Availability) {
          formik.setFieldValue("time", timeRange);
        } else {
          console.log("inside else");
          const timeRange = "The doctor is not available today";
          formik.setFieldValue("time", timeRange);
        }
      }
    }
  }, [formik.values.doctor, doctors]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/states")
      .then((res) => {
        console.log("response", res.data);
        setStates(res.data); // assuming res.data is an array of state strings
      })
      .catch((err) => {
        console.error("Failed to load states", err);
        setStates([]);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/getdisease")
      .then((res) => {
        console.log("response", res.data);
        setDiseases(res.data); // assuming res.data is an array of state strings
      })
      .catch((err) => {
        console.error("Failed to load states", err);
        setDiseases([]);
      });
  }, []);

  const handleOtpClick = () => {
    const Email = formik.values.email;

    if (!Email) {
      alert("Please enter an email before sending OTP.");
      return;
    }

    axios
      .post("http://localhost:5000/admin/send-otp", { Email })
      .then(() => {
        alert("OTP sent to email.");
        setOtpVisible(true);
      })
      .catch(() => alert("Failed to send OTP."));
  };

  const handleVerifyOtp = () => {
    axios
      .post("http://localhost:5000/admin/verify-otp", {
        Email: formik.values.email,
        Otp: otp.trim(),
      })
      .then((res) => {
        if (res.data.success) {
          alert("Email verified successfully!");
          setEmailVerified(true);
        } else {
          alert("Invalid OTP. Try again.");
        }
      })
      .catch(() => alert("OTP verification failed."));
  };

  return (
    <div className="container-fluid px-0">
      {/* Image at Top */}
      <div className="app-img mb-4"></div>

      {/* Form Below Image */}
      <div className="px-4">
        <h3 className="text-center mb-4">Book an Appointment</h3>
        <form onSubmit={formik.handleSubmit}>
          <div className="row g-3">
            {/* Full Name */}
            <div className="col-md-4">
              <label className="form-label fw-bold">Full Name</label>
              <input
                type="text"
                name="fullName"
                className="form-control"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fullName}
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="text-danger">{formik.errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="col-md-4">
              <label className="form-label fw-bold">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                disabled={emailVerified}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-danger">{formik.errors.email}</p>
              )}
              {!emailVerified && (
                <button
                  type="button"
                  className="btn btn-warning mt-1 w-25"
                  onClick={handleOtpClick}
                >
                  Send OTP
                </button>
              )}
              {emailVerified && (
                <span className="text-success d-block mt-1 fw-bold">
                  Email Verified
                </span>
              )}
            </div>

            {/* Phone */}
            <div className="col-md-4">
              <label className="form-label fw-bold">Mobile</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-danger">{formik.errors.phone}</p>
              )}
            </div>

            {/* OTP Field */}
            {otpVisible && !emailVerified && (
              <div className="col-md-4">
                <label className="form-label fw-bold">Enter OTP</label>
                <input
                  type="text"
                  className="form-control"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\s+/g, ""))}
                />
                <button
                  type="button"
                  className="btn btn-success mt-1 w-100"
                  onClick={handleVerifyOtp}
                >
                  Verify OTP
                </button>
              </div>
            )}

            {/* State */}
            <div className="col-md-4">
              <label className="form-label fw-bold">State</label>
              <select
                name="state"
                className="form-control"
                onChange={(e) => {
                  const selectedState = e.target.value;
                  formik.handleChange(e);
                  formik.setFieldValue("city", "");
                  axios
                    .get("http://localhost:5000/admin/cities", {
                      params: { state: selectedState },
                    })
                    .then((res) => setCities(res.data))
                    .catch(() => setCities([]));
                }}
                value={formik.values.state}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="col-md-4">
              <label className="form-label fw-bold">City</label>
              <select
                name="city"
                className="form-control"
                onChange={formik.handleChange}
                value={formik.values.city}
                disabled={!city.length}
              >
                <option value="">Select City</option>
                {city.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Disease */}
            <div className="col-md-4">
              <label className="form-label fw-bold">Disease</label>
              <select
                name="disease"
                className="form-control"
                onChange={formik.handleChange}
                value={formik.values.disease}
              >
                <option value="">Select Disease</option>
                {diseases.map((d) => (
                  <option key={d._id} value={d.disease}>
                    {d.disease}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="col-md-4">
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

            {/* Doctor */}
            <div className="col-md-4">
              <label className="form-label fw-bold">Doctor</label>
              <select
                name="doctor"
                className="form-control"
                onChange={formik.handleChange}
                value={formik.values.doctor}
                disabled={!Array.isArray(doctors) || doctors.length === 0}
              >
                <option value="">Select Doctor</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc.Name}>
                    {doc.Name}
                  </option>
                ))}
              </select>
              {formik.touched.doctor && formik.errors.doctor && (
                <p className="text-danger">{formik.errors.doctor}</p>
              )}
            </div>

            {/* Availability */}
            <div className="col-md-4">
              <label className="form-label fw-bold">Availability</label>
              <input
                type="text"
                name="time"
                className="form-control"
                readOnly
                value={formik.values.time}
              />
            </div>

            {/* Reason (full row) */}
            <div className="col-md-12">
              <label className="form-label fw-bold">Reason</label>
              <textarea
                className="form-control w-50"
                name="reason"
                rows="3"
                placeholder="Brief description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.reason}
              ></textarea>
            </div>

            {/* Submit */}
            <div className="col-md-12">
              <button type="submit" className="btn btn-primary w-50">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
