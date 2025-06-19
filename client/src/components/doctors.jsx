import { useState } from "react";
import { Link } from "react-router-dom";

export function Doctors() {
  const [state, setState] = useState([{ image: "", Name: "", About: "" }]);

  return (
    <div>
      <div className="fs-4 fw-bold">
        {" "}
        <Link
          to="/"
          className="text-primary fw-normal pe-2 text-decoration-none"
        >
          Home »
        </Link>
        Doctors
      </div>
    </div>
  );
}
