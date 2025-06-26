import axios from "axios";
import "./doctors.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Doctors() {
  const [state, setState] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/alldoctors")
      .then((response) => {
        setState(response.data);
      })
      .catch((error) => {
        console.error("Error fetching doctor data:", error);
      });
  }, []);

  return (
    <div>
      <div className="fs-3 fw-bold" style={{ color: "grey" }}>
        <u>Doctors</u>
      </div>
      <section id="skills" className="doc-section">
        <div className="doc-grid">
          {state.map((item, index) => (
            <div className="doc-item" key={index}>
              <Link to={`/doctor/${encodeURIComponent(item.Email)}`}>
                <img
                  src={`http://localhost:5000/uploads/${item.image}`}
                  alt="doc-img"
                />
              </Link>
              <p className="doc-label" style={{ color: "blue" }}>
                {item.Name}
              </p>
              <p className="doc-label text-dark">
                <strong>Specialization:</strong> {item.Specialization}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
