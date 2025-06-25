import axios from "axios";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

export function DoctorProfile() {
  const [docData, setDocData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [cookies] = useCookies(["email"]);
  const [selectedFile, setSelectedFile] = useState(null);
  const decodedEmail = decodeURIComponent(cookies.email);

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

  const handleImageChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const hasChanges =
    JSON.stringify({ ...docData, image: undefined }) !==
      JSON.stringify({ ...originalData, image: undefined }) ||
    selectedFile !== null;

  const handleSave = async () => {
    const formData = new FormData();
    Object.entries(docData).forEach(([key, value]) => {
      if (key !== "Email") {
        formData.append(key, value);
      }
    });
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/admin/updatedoctor/${decodedEmail}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Profile updated successfully");
      setIsEditing(false);
      setDocData(res.data.updatedDoctor);
      setOriginalData(res.data.updatedDoctor);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setDocData(originalData);
    setSelectedFile(null);
    setIsEditing(false);
  };

  if (!docData) {
    return <div className="text-center mt-5">Loading Doctor Profile...</div>;
  }

  return (
    <div className="container mt-1">
      <div className="card shadow p-4">
        <div className="row">
          {/* Image Section */}
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
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-control"
                />
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="col-md-8">
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <th>Name:</th>
                  <td>
                    <input
                      name="Name"
                      className="form-control"
                      disabled={!isEditing}
                      value={docData.Name}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Email:</th>
                  <td>
                    <input
                      className="form-control"
                      disabled
                      value={docData.Email}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Password:</th>
                  <td>
                    <input
                      name="Password"
                      className="form-control"
                      disabled={!isEditing}
                      value={docData.Password}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Age:</th>
                  <td>
                    <input
                      name="Age"
                      className="form-control"
                      disabled={!isEditing}
                      value={docData.Age}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Designation:</th>
                  <td>
                    <input
                      name="Designation"
                      className="form-control"
                      disabled={!isEditing}
                      value={docData.Designation}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Specialization:</th>
                  <td>
                    <input
                      name="Specialization"
                      className="form-control"
                      disabled={!isEditing}
                      value={docData.Specialization}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Location:</th>
                  <td>
                    <input
                      name="City"
                      className="form-control mb-2"
                      disabled={!isEditing}
                      value={docData.City}
                      onChange={handleInputChange}
                    />
                    <input
                      name="State"
                      className="form-control"
                      disabled={!isEditing}
                      value={docData.State}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>About:</th>
                  <td>
                    <textarea
                      name="About"
                      className="form-control"
                      disabled={!isEditing}
                      value={docData.About}
                      onChange={handleInputChange}
                    ></textarea>
                  </td>
                </tr>
                <tr>
                  <th>Availability:</th>
                  <td>
                    <input
                      name="Availability"
                      type="checkbox"
                      className="form-check-input"
                      disabled={!isEditing}
                      checked={docData.Availability}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label ms-2">
                      {docData.Availability ? "Available" : "Not Available"}
                    </label>
                  </td>
                </tr>
                <tr>
                  <th>Working Hours:</th>
                  <td>
                    <input
                      name="From"
                      className="form-control mb-2"
                      disabled={!isEditing}
                      value={docData.From}
                      onChange={handleInputChange}
                    />
                    <input
                      name="To"
                      className="form-control"
                      disabled={!isEditing}
                      value={docData.To}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {!isEditing ? (
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  className="btn btn-success me-2"
                  onClick={handleSave}
                  disabled={!hasChanges}
                >
                  Save Changes
                </button>
                <button
                  className="btn btn-secondary mb-3"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
