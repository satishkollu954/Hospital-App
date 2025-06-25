import React, { useState, useEffect } from "react";
import axios from "axios";
import "./addDoctors.css";
import { useNavigate } from "react-router-dom";

export function AddDoctors() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Name: "",
    About: "",
    Email: "",
    Designation: "",
    Specialization: "",
    Age: "",
    State: "",
    City: "",
    From: "",
    FromPeriod: "AM",
    To: "",
    ToPeriod: "PM",
    Availability: true,
    Learnmore: "",
  });

  const [image, setImage] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/states")
      .then((res) => setStates(res.data))
      .catch((err) => console.error("Error fetching states:", err));
  }, []);

  useEffect(() => {
    if (selectedState) {
      axios
        .get("http://localhost:5000/admin/cities", {
          params: { state: selectedState },
        })
        .then((res) => setCities(res.data))
        .catch((err) => console.error("Error fetching cities:", err));
    } else {
      setCities([]);
    }
  }, [selectedState]);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "Availability" ? value === "true" : value,
    }));

    if (name === "State") {
      setSelectedState(value);
      setFormData((prev) => ({ ...prev, City: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const formatTime = (time) => {
    if (!time.includes(":")) {
      return `${time.padStart(2, "0")}:00`;
    }
    return time;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      const finalFormData = {
        ...formData,
        From: `${formatTime(formData.From)} ${formData.FromPeriod}`,
        To: `${formatTime(formData.To)} ${formData.ToPeriod}`,
      };

      delete finalFormData.FromPeriod;
      delete finalFormData.ToPeriod;

      data.append("image", image);
      for (const key in finalFormData) {
        data.append(key, finalFormData[key]);
      }

      const res = await axios.post(
        "http://localhost:5000/admin/addDoctors",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(res.data.message);
      navigate("/admin-dashboard");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Something went wrong while adding doctor."
      );
    }
  };

  return (
    <div className="add-doc-container">
      <h2 className="text-center mb-4">Add Doctor</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row">
          <div className="col-md-4 form-group">
            <label>Name:</label>
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleTextChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-4 form-group">
            <label>Email:</label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleTextChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-4 form-group">
            <label>Designation:</label>
            <input
              type="text"
              name="Designation"
              value={formData.Designation}
              onChange={handleTextChange}
              className="form-control"
              required
            />
          </div>

          <div className="col-md-4 form-group">
            <label>Specialization:</label>
            <input
              type="text"
              name="Specialization"
              value={formData.Specialization}
              onChange={handleTextChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-4 form-group">
            <label>Age:</label>
            <input
              type="number"
              name="Age"
              value={formData.Age}
              onChange={handleTextChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-4 form-group">
            <label>About:</label>
            <input
              type="text"
              name="About"
              value={formData.About}
              onChange={handleTextChange}
              className="form-control"
              required
            />
          </div>

          <div className="col-md-4 form-group">
            <label>State:</label>
            <select
              name="State"
              className="form-control"
              value={formData.State}
              onChange={handleTextChange}
              required
            >
              <option value="">Select State</option>
              {states.map((state, idx) => (
                <option key={idx} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 form-group">
            <label>City:</label>
            <select
              name="City"
              className="form-control"
              value={formData.City}
              onChange={handleTextChange}
              required
            >
              <option value="">Select City</option>
              {cities.map((city, idx) => (
                <option key={idx} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 form-group time-input-wrapper">
            <label>From:</label>
            <div className="d-flex">
              <input
                type="text"
                name="From"
                value={formData.From}
                onChange={handleTextChange}
                placeholder="e.g. 10:00"
                className="form-control me-2"
                required
              />
              <select
                name="FromPeriod"
                value={formData.FromPeriod}
                onChange={handleTextChange}
                className="form-control"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <div className="col-md-4 form-group time-input-wrapper">
            <label>To:</label>
            <div className="d-flex">
              <input
                type="text"
                name="To"
                value={formData.To}
                onChange={handleTextChange}
                placeholder="e.g. 05:00"
                className="form-control me-2"
                required
              />
              <select
                name="ToPeriod"
                value={formData.ToPeriod}
                onChange={handleTextChange}
                className="form-control"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <div className="col-md-4 form-group">
            <label>Availability:</label>
            <select
              name="Availability"
              value={formData.Availability}
              onChange={handleTextChange}
              className="form-control"
            >
              <option value={true}>Available</option>
              <option value={false}>Not Available</option>
            </select>
          </div>

          <div className="col-md-4 form-group">
            <label>Upload Image:</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Learn More URL</label>
            <input
              type="url"
              name="Learnmore"
              value={formData.Learnmore}
              onChange={handleChange}
              className="form-control"
              placeholder="https://example.com/learn-more"
            />
          </div>
        </div>

        <div className="button-row mt-4 d-flex gap-3">
          <button
            type="button"
            className="btn btn-secondary w-50"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button type="submit" className="btn btn-primary w-50">
            Add Doctor
          </button>
        </div>
      </form>
    </div>
  );
}
