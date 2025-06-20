import React, { useState } from "react";
import axios from "axios";
import "./addDoctors.css";
import { useNavigate } from "react-router-dom";

export function AddDoctors() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Name: "",
    About: "",
  });
  const [image, setImage] = useState(null);

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("image", image);
      data.append("Name", formData.Name);
      data.append("About", formData.About);

      await axios.post("http://localhost:5000/admin/addDoctors", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Doctor added successfully");
      setFormData({ Name: "", About: "" });
      setImage(null);
    } catch (err) {
      alert("Error adding doctor");
      console.error(err);
    }
  };

  return (
    <div className="add-doc-container">
      <h2>Add Doctor</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Upload Image:</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleTextChange}
            required
          />
        </div>
        <div className="form-group">
          <label>About:</label>
          <input
            type="text"
            name="About"
            value={formData.About}
            onChange={handleTextChange}
            required
          />
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
