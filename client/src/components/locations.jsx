import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Location.css";

export const Location = () => {
  const [hospital, setLocations] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/locations")
      .then((res) => setLocations(res.data))
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4">Our Locations</h2>
      <div className="row">
        {hospital.map((hospital, index) => (
          <div key={index} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow h-100">
              <div className="card-body">
                <h5 className="card-title">{hospital.name}</h5>
                <p className="card-text">
                  Location: <strong>{hospital.city}</strong>
                </p>
                <a
                  href={hospital.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  View on Map <i className="bi bi-geo-alt-fill ms-2"></i>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
