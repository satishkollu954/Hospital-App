import { useState } from "react";
import axios from "axios";

export function AddDiseases() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      setMessage("Please fill in all fields.");
      return;
    }

    axios
      .post("http://localhost:5000/admin/adddisease", formData)
      .then(() => {
        setMessage("Treatment added successfully!");
        setFormData({ name: "", description: "" });
      })
      .catch((err) => {
        console.error(err);
        setMessage("Failed to add treatment. Please try again.");
      });
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <form
        onSubmit={handleSubmit}
        className="w-50 border p-4 shadow rounded bg-light"
      >
        <h3 className="mb-4 text-center">Add Treatment</h3>

        <div className="mb-3">
          <label className="form-label fw-bold">Name of the Treatment</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g. Heart Surgery"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter description of the treatment"
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Add Treatment
        </button>

        {message && (
          <div className="alert alert-info mt-3" role="alert">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
