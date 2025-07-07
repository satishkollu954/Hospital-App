import axios from "axios";
import "./doctors.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Doctors() {
  const { t, i18n } = useTranslation();
  const [doctors, setDoctors] = useState([]);

  /* 🔄 refetch whenever language changes */
  useEffect(() => {
    const controller = new AbortController();

    axios
      .get("http://localhost:5000/admin/alldoctors", {
        params: { lang: i18n.language }, // hi | te | en | …
        signal: controller.signal,
      })
      .then((res) => 
        
      {console.log("==========================")
         setDoctors(res.data)})      
       
      .catch((err) => {
        if (err.name !== "CanceledError") {
          console.error("Error fetching doctor data:", err);
          setDoctors([]);
        }
      });

    return () => controller.abort();
  }, [i18n.language]);

  return (
    <div>
      <div className="fs-3 fw-bold" style={{ color: "grey" }}>
        {t("doctors.title")}
      </div>

      <section id="skills" className="doc-section">
        <div className="doc-grid">
          {doctors.map((doc) => (
            <div className="doc-item" key={doc._id}>
              <Link to={`/doctor/${encodeURIComponent(doc.Email)}`}>
                <img
                  src={`http://localhost:5000/uploads/${doc.image}`}
                  alt={t("doctors.imageAlt", { name: doc.Name })}
                />
              </Link>

              <p className="doc-label" style={{ color: "blue" }}>
                {doc.Name}
              </p>

              <p className="doc-label text-dark">
                <strong>{t("doctors.specialization")}:</strong>{" "}
                {doc.Specialization}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
