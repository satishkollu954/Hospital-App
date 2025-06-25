import { Link } from "react-router-dom";
import "./treatments.css";
import { useEffect, useState } from "react";
import axios from "axios";

export function Treatment() {
  const [state, setState] = useState([{ disease: "", description: "" }]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/getdisease")
      .then((response) => {
        setState(response.data);
      })
      .catch((reason) => {
        console.log(reason);
      });
  }, []);

  return (
    <div>
      <div className="trm-bg"></div>
      <br />
      <div className="fs-4 fw-bold trt-text">
        {" "}
        <Link
          to="/"
          className="text-primary fw-normal pe-2 text-decoration-none"
        >
          Home »
        </Link>
        Conditions Treated
      </div>
      <div className="trt-bottom">
        <div className="trt-bottom-left">
          RaagviCare provides a comprehensive range of medical, cosmetic,
          surgical, and aesthetic dermatology treatments and services. We also
          offer state-of-the-art plastic and reconstructive surgery options to
          rejuvenate the health and appearance of your skin. <br />
          <br />
          The skin is the largest organ in the human body, requiring constant
          attention, detailed examination and diagnosis, and expert care. We
          treat your dermatology condition with a patient-first approach,
          compassionate care, and advanced treatment methods, ensuring your mind
          and body are at their healthiest. <br />
          <br />
          To schedule an appointment, please give us a call today. To learn more
          about the conditions we treat, simply select from our menu below.
        </div>
        <div className="trt-bottom-right">
          <img src="/trt-img.jpg" alt="Hospital Care" />
        </div>
      </div>{" "}
      <br />
      <br />
      <div className="card-bg">
        <div className="d-flex flex-wrap gap-3 justify-content-center">
          {state.map((item, index) => (
            <div
              key={index}
              className="card p-2 m-2 shadow h-150"
              style={{ width: "300px" }}
            >
              <div
                className="card-header fs-5 fw-bold"
                style={{ color: "gray" }}
              >
                {item.disease}
              </div>
              <div className="card-body fs-6" style={{ color: "grey" }}>
                {item.description}
              </div>
              <div className="ms-3">
                <a href={item.learnmore} style={{ color: "grey" }}>
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
