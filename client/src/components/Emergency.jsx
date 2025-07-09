import { Link } from "react-router-dom";
import "./Emergency.css";
import { useEffect, useState } from "react";
import axios from "axios";

export function Emergency() {
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [conditions, setConditions]=useState([]);
  const selectedDiseases = ["Cardiology", "Child Health", "Orthopedics", "Gastroenterology", "Asthma"];

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/locations")
      .then((res) => {
        const limitedStates = res.data.slice(0, 6); // first 6 states
        const oneBranchPerState = limitedStates
          .filter((loc) => loc.branches.length > 0)
          .map((loc) => ({
            state: loc.State,
            branch: loc.branches[0], // first branch of that state
          }));
        setSelectedBranches(oneBranchPerState);
      })
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);


  useEffect(()=>{
    axios
      .get("http://localhost:5000/admin/getdisease")
      .then((res) => {
         const filtered = res.data.filter((item) =>
          selectedDiseases.includes(item.disease)
        );
        setConditions(filtered);
      })
      .catch((err) => console.error("Error fetching conditions:", err));
  },[])

  return (
    <div>
      {/* Banner */}
      <div className="emergency-bg text-white text-start d-flex align-items-center">
        <h3 className="emergency-bg-text">Save the number - XXXXXXXX</h3>
      </div>

      {/* Heading */}
      <div className=" my-4 text-center">
        <h4>We offer immediate care at 6 convenient walk-in locations</h4>
        <h4 className="mt-3">Our Locations</h4>
      </div>

      {/* Location Cards */}
      <div className="row mt-4 px-3">
        {selectedBranches.map((entry, index) => (
          <div key={index} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title text-primary">{entry.state}</h5>
                <p className="mb-1">
                  <strong>City:</strong> {entry.branch.name}
                </p>
                <a
                  href={entry.branch.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary"
                >
                  View on Map
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center my-4"> 
        <h4>Some of the Conditions We Treat at Immediate Care</h4>
      </div>
       <div className="row">
        {conditions.map((item) => (
          <div key={item._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary">{item.disease}</h5>
                <p className="card-text" style={{ fontSize: "0.95rem" }}>
                  {item.description}
                </p>
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
