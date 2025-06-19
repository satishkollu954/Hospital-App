import axios from "axios";
import "./doctors.css";
import { useEffect, useState } from "react";

export function Doctors() {
  const [state, setState] = useState([{ image: "", Name: "", About: "" }]);

  useEffect(() => {
    axios.get("doctors.json").then((response) => {
      setState(response.data);
    });
  }, []);

  return (
    <div>
      <div className="fs-3 fw-bold" style={{ color: "grey" }}>
        <u>Doctors</u>
      </div>
      <div>
        <section id="skills" className="doc-section">
          <div className="doc-grid">
            {state.map((item, index) => (
              <div className="doc-item" key={index}>
                <img src={item.image} alt="doc-img" />
                <p className="doc-label" style={{ color: "blue" }}>
                  {item.Name}
                </p>
                <p className="doc-label">{item.About}</p>
                <p className="doc-label">
                  <a href="https://www.northshore.org/apps/findadoctor/physicians/jaime-beth-alexander">
                    Learn More
                  </a>
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
