import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Location.css";

export const Location = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/locations")
      .then((res) => setLocations(res.data))
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  return (
    <div className="location-bg d-flex justify-content-center align-items-start">
      <div className="container location-overlay mt-5">
        <h2 className="text-center text-primary mb-4">Our Locations</h2>
        <div className="row">
          {locations.map((location, cityIndex) => (
            <div key={cityIndex} className="col-12 mb-4">
              <h4 className="mb-3 text-secondary">{location.city}</h4>
              <div className="row">
                {location.branches.map((branch, branchIndex) => (
                  <div key={branchIndex} className="col-md-6 col-lg-4 mb-3">
                    <div className="card shadow h-100">
                      <div className="card-body">
                        <h5 className="card-title">{branch.name}</h5>
                        <a
                          href={branch.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                        >
                          View on Map{" "}
                          <i className="bi bi-geo-alt-fill ms-2"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
