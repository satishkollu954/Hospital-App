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
    To: "",
    Availability: true,
  });

  const [image, setImage] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  // Fetch all states on load
  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/states")
      .then((res) => setStates(res.data))
      .catch((err) => console.error("Error fetching states:", err));
  }, []);

  // Fetch cities when a state is selected
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

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("image", image);
      for (const key in formData) {
        data.append(key, formData[key]);
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
      <h2>Add Doctor</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-row-3">
          <div className="row">
            <div className="col-md-6 form-group">
              <label>Name:</label>
              <input
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleTextChange}
                required
              />
            </div>
            <div className="col-md-6 form-group">
              <label>Email:</label>
              <input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleTextChange}
                required
              />
            </div>

            <div className="col-md-6 form-group">
              <label>Designation:</label>
              <input
                type="text"
                name="Designation"
                value={formData.Designation}
                onChange={handleTextChange}
                required
              />
            </div>
          </div>
          <div className="form-row-3">
            <div className="col-md-6 form-group">
              <label>Specialization:</label>
              <input
                type="text"
                name="Specialization"
                value={formData.Specialization}
                onChange={handleTextChange}
                required
              />
            </div>

            <div className="col-md-6 form-group">
              <label>Age:</label>
              <input
                type="number"
                name="Age"
                value={formData.Age}
                onChange={handleTextChange}
                required
              />
            </div>
            <div className="col-md-6 form-group">
              <label>About:</label>
              <input
                type="text"
                name="About"
                value={formData.About}
                onChange={handleTextChange}
                required
              />
            </div>
          </div>
          <div className="form-row-3">
            <div className="col-md-6 form-group">
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

            <div className="col-md-6 form-group">
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

            <div className="col-md-6 form-group">
              <label>From (Time):</label>
              <input
                type="text"
                name="From"
                value={formData.From}
                onChange={handleTextChange}
                placeholder="e.g. 10:00 AM"
                required
              />
            </div>
          </div>
          <div className="form-row-3">
            <div className="col-md-6 form-group">
              <label>To (Time):</label>
              <input
                type="text"
                name="To"
                value={formData.To}
                onChange={handleTextChange}
                placeholder="e.g. 05:00 PM"
                required
              />
            </div>
            <div className="form-group">
              <label>Upload Image:</label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                required
              />
            </div>
            <div className="col-md-6 form-group">
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
          </div>
        </div>

        <div className="button-row">
          <button
            type="button"
            className="btn btn-primary w-50"
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
