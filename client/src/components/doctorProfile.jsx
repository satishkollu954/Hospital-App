import axios from "axios";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
export function DoctorProfile() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["email"]);
  const decodedEmail = decodeURIComponent(cookies.email);
  const [docData, setDocData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/admin/doctor/${decodedEmail}`)
      .then((res) => {
        setDocData(res.data);
        setOriginalData(res.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [decodedEmail]);
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setDocData((prevData) => ({ ...prevData, [name]: val }));
  };
  const handleImageChange = (e) => setSelectedFile(e.target.files[0]);
  const handleLanguagesChange = (index, value) => {
    const updated = [...docData.Languages];
    updated[index] = value;
    setDocData({ ...docData, Languages: updated });
  };
  const addLanguage = () =>
    setDocData((prev) => ({
      ...prev,
      Languages: [...(prev.Languages || []), ""],
    }));
  const removeLanguage = (index) => {
    const updated = [...docData.Languages];
    updated.splice(index, 1);
    setDocData({ ...docData, Languages: updated });
  };
  const handleEducationChange = (index, field, value) => {
    const updated = [...docData.Education];
    updated[index][field] = value;
    setDocData({ ...docData, Education: updated });
  };
  const addEducation = () =>
    setDocData((prev) => ({
      ...prev,
      Education: [
        ...(prev.Education || []),
        { degree: "", institution: "", year: "" },
      ],
    }));
  const removeEducation = (index) => {
    const updated = [...docData.Education];
    updated.splice(index, 1);
    setDocData({ ...docData, Education: updated });
  };
  const hasChanges =
    JSON.stringify({ ...docData, image: undefined }) !==
      JSON.stringify({ ...originalData, image: undefined }) ||
    selectedFile !== null;
  const handleSave = async () => {
    const formData = new FormData();
    Object.entries(docData).forEach(([key, value]) => {
      if (key === "Languages" || key === "Education") {
        formData.append(key, JSON.stringify(value));
      } else if (key !== "Email") {
        formData.append(key, value);
      }
    });
    if (selectedFile) formData.append("image", selectedFile);
    try {
      const res = await axios.put(
        `http://localhost:5000/admin/updatedoctor/${decodedEmail}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Profile updated successfully");
      // alert("Profile updated successfully");
      setIsEditing(false);
      setDocData(res.data.updatedDoctor);
      setOriginalData(res.data.updatedDoctor);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      // alert("Failed to update profile");
    }
  };
  const handleCancel = () => {
    setDocData(originalData);
    setSelectedFile(null);
    setIsEditing(false);
  };
  if (!docData)
    return <div className="text-center mt-5">Loading Doctor Profile...</div>;
  return (
    <div className="container mt-3">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="card shadow p-4">
        <div className="row">
          <div className="col-md-4 text-center mb-3">
            {docData.image ? (
              <img
                src={`http://localhost:5000/uploads/${docData.image}`}
                alt="Doctor"
                className="img-fluid rounded-circle border"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            ) : (
              <div
                className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                style={{ width: "150px", height: "150px" }}
              >
                No Image
              </div>
            )}
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="form-control mt-2"
              />
            )}
          </div>
          <div className="col-md-8">
            <div className="table-responsive">
              <table className="table table-borderless align-middle">
                <tbody>
                  {[
                    "Name",
                    "Email",
                    "Password",
                    "Age",
                    "Designation",
                    "Specialization",
                    "State",
                    "City",
                    "From",
                    "To",
                    "Learnmore",
                    "Qualification",
                    "Experience",
                  ].map((field) => (
                    <tr key={field}>
                      <th style={{ width: "30%" }}>{field}:</th>
                      <td>
                        <input
                          name={field}
                          className="form-control"
                          disabled={field === "Email" || !isEditing}
                          value={docData[field] || ""}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <th>BriefProfile:</th>
                    <td>
                      <textarea
                        name="BriefProfile"
                        className="form-control"
                        disabled={!isEditing}
                        value={docData.BriefProfile || ""}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>Address:</th>
                    <td>
                      <textarea
                        name="Address"
                        className="form-control"
                        disabled={!isEditing}
                        value={docData.Address || ""}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>Availability:</th>
                    <td>
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          name="Availability"
                          className="form-check-input"
                          disabled={!isEditing}
                          checked={docData.Availability}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label ms-2">
                          {docData.Availability ? "Available" : "Not Available"}
                        </label>
                      </div>
                    </td>
                  </tr>
                  {/* Languages */}
                  <tr>
                    <th>Languages:</th>
                    <td>
                      {!isEditing ? (
                        <div className="form-control bg-light w-50 ">
                          {(docData.Languages || []).join(", ")}
                        </div>
                      ) : (
                        <>
                          {(docData.Languages || []).map((lang, i) => (
                            <div key={i} className="input-group mb-2">
                              <input
                                className="form-control"
                                value={lang}
                                onChange={(e) =>
                                  handleLanguagesChange(i, e.target.value)
                                }
                              />
                              <button
                                className="btn btn-danger"
                                onClick={() => removeLanguage(i)}
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={addLanguage}
                          >
                            + Add Language
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                  {/* Education */}
                  <tr>
                    <th>Education:</th>
                    <td>
                      {!isEditing ? (
                        <div className="form-control bg-light w-50">
                          {(docData.Education || [])
                            .map(
                              (edu) =>
                                `${edu.degree}, ${edu.institution}, ${edu.year}`
                            )
                            .join("\n")}
                        </div>
                      ) : (
                        <>
                          {(docData.Education || []).map((edu, i) => (
                            <div key={i} className="row mb-2">
                              <div className="col">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Degree"
                                  value={edu.degree}
                                  onChange={(e) =>
                                    handleEducationChange(
                                      i,
                                      "degree",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div className="col">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Institution"
                                  value={edu.institution}
                                  onChange={(e) =>
                                    handleEducationChange(
                                      i,
                                      "institution",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div className="col">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Year"
                                  value={edu.year}
                                  onChange={(e) =>
                                    handleEducationChange(
                                      i,
                                      "year",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div className="col-auto">
                                <button
                                  className="btn btn-danger"
                                  onClick={() => removeEducation(i)}
                                >
                                  &times;
                                </button>
                              </div>
                            </div>
                          ))}
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={addEducation}
                          >
                            + Add Education
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Action Buttons */}
            <div className="mt-3">
              {!isEditing ? (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="btn btn-primary ms-2"
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-success me-2 mt-3"
                    onClick={handleSave}
                    disabled={!hasChanges}
                  >
                    Save Changes
                  </button>
                  <button className="btn btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
