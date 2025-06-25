import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";

export function ALLDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/alldoctors")
      .then((res) => {
        setDoctors(res.data);
        setFilteredDoctors(res.data);
      })
      .catch((err) => console.error("Error fetching doctors", err));
  }, []);

  const handleViewClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditDoctor(null);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = doctors.filter((doc) =>
      doc.Name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditDoctor({ ...selectedDoctor });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    axios
      .put(
        `http://localhost:5000/admin/updatedoctor/${editDoctor.Email}`,
        editDoctor
      )
      .then(() => {
        alert("Doctor updated successfully");
        const updatedList = doctors.map((doc) =>
          doc.Email === editDoctor.Email ? editDoctor : doc
        );
        setDoctors(updatedList);
        setFilteredDoctors(updatedList);
        setIsEditing(false);
        setEditDoctor(null);
        setShowModal(false);
      })
      .catch(() => alert("Update failed"));
  };

  const handleDelete = (email) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    axios
      .delete(`http://localhost:5000/admin/deletedoctor/${email}`)
      .then(() => {
        const updatedList = doctors.filter((doc) => doc.Email !== email);
        setDoctors(updatedList);
        setFilteredDoctors(updatedList);
        setShowModal(false);
        alert("Doctor deleted successfully");
      })
      .catch(() => alert("Failed to delete doctor"));
  };

  return (
    <div className="container">
      <h3 className="mb-3">All Doctors</h3>
      <div>
        <Form.Control
          type="text"
          placeholder="Search by Name"
          value={searchTerm}
          onChange={handleSearch}
          className="mb-4 w-50"
        />
      </div>
      <div className="container-fluid">
        <div className="row g-4">
          {filteredDoctors.map((doctor, index) => (
            <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={`http://localhost:5000/uploads/${doctor.image}`}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{doctor.Name}</Card.Title>
                  <Card.Text>
                    <strong>Specialization:</strong> {doctor.Specialization}
                  </Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => handleViewClick(doctor)}
                  >
                    View
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Doctor Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isEditing && editDoctor ? (
            <>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="Name"
                  value={editDoctor.Name}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  name="Designation"
                  value={editDoctor.Designation}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Specialization</Form.Label>
                <Form.Control
                  name="Specialization"
                  value={editDoctor.Specialization}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>State</Form.Label>
                <Form.Control
                  name="State"
                  value={editDoctor.State}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>City</Form.Label>
                <Form.Control
                  name="City"
                  value={editDoctor.City}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>From</Form.Label>
                <Form.Control
                  name="From"
                  value={editDoctor.From}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>To</Form.Label>
                <Form.Control
                  name="To"
                  value={editDoctor.To}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>About</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="About"
                  value={editDoctor.About}
                  onChange={handleEditChange}
                />
              </Form.Group>
            </>
          ) : selectedDoctor ? (
            <>
              <p>
                <strong>Email:</strong> {selectedDoctor.Email}
              </p>
              <p>
                <strong>Designation:</strong> {selectedDoctor.Designation}
              </p>
              <p>
                <strong>Specialization:</strong> {selectedDoctor.Specialization}
              </p>
              <p>
                <strong>Age:</strong> {selectedDoctor.Age}
              </p>
              <p>
                <strong>State:</strong> {selectedDoctor.State}
              </p>
              <p>
                <strong>City:</strong> {selectedDoctor.City}
              </p>
              <p>
                <strong>Timing:</strong> {selectedDoctor.From} -{" "}
                {selectedDoctor.To}
              </p>
              <p>
                <strong>About:</strong> {selectedDoctor.About}
              </p>
            </>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          {isEditing ? (
            <>
              <Button variant="success" onClick={handleEditSave}>
                Save
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="warning" onClick={handleEditClick}>
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(selectedDoctor.Email)}
              >
                Remove
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
