import axios from "axios";
import { useEffect, useState } from "react";
import "./AllQueries.css";

export function AllQueries() {
  const [state, setState] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/admin/Allqueries").then((response) => {
      setState(response.data);
    });
  }, []);

  return (
    <div className="container my-4">
      <h3 className="text-center mb-4">User Queries</h3>
      <div className="table-responsive">
        <table className="table table-bordered table-hover shadow-sm rounded">
          <thead className="table-primary">
            <tr className="text-center">
              <th>Full Name</th>
              <th>Email</th>
              <th>Mobile No.</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {state.map((data, index) => (
              <tr key={data._id || index}>
                <td>{data.fullName}</td>
                <td>{data.email}</td>
                <td>{data.contact}</td>
                <td className="text-wrap message-cell">{data.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
