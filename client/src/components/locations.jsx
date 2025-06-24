import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Location.css";

export const Location = () => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/locations")
      .then((res) => setCities(res.data))
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-5">Our Locations</h2>
      {cities.map((cityData, index) => (
        <div key={index} className="mb-5">
          <h4 className="text-dark fw-bold mb-3">{cityData.State}</h4>
          <div className="row">
            {cityData.branches.map((branch, idx) => (
              <div key={idx} className="col-md-6 col-lg-4 mb-4">
                <div className="card shadow h-100">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title">{branch.name}</h5>
                    </div>
                    <a
                      href={branch.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary mt-3"
                    >
                      View on Map <i className="bi bi-geo-alt-fill ms-1"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
