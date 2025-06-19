import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export const Location = () => {
  const hospitals = [
    {
      name: "RaagviCare Hospital - Delhi",
      city: "Delhi",
      mapUrl: "https://www.google.com/maps?q=28.6139,77.2090", // Delhi coordinates
    },
    {
      name: "RaagviCare Hospital - Mumbai",
      city: "Mumbai",
      mapUrl: "https://www.google.com/maps?q=19.0760,72.8777", // Mumbai coordinates
    },
    {
      name: "RaagviCare Hospital - Bangalore",
      city: "Bangalore",
      mapUrl: "https://www.google.com/maps?q=12.9716,77.5946", // Bangalore coordinates
    },
    {
      name: "RaagviCare Hospital - Hyderabad",
      city: "Hyderabad",
      mapUrl: "https://www.google.com/maps?q=17.3850,78.4867", // Hyderabad coordinates
    },
  ];

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4">Our Locations</h2>
      <div className="row">
        {hospitals.map((hospital, index) => (
          <div key={index} className="col-md-6 col-lg-6 mb-4">
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
