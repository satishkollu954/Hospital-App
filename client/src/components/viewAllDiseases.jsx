import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Button, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

export function ALLDiseases() {
  const [diseases, setDiseases] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({
    disease: "",
    description: "",
    learnmore: "",
  });
  const [originalData, setOriginalData] = useState(null); // For change comparison
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchDiseases();
  }, []);

  const fetchDiseases = () => {
    axios
      .get("http://localhost:5000/admin/getdisease")
      .then((res) => setDiseases(res.data))
      .catch((err) => console.error("Error fetching diseases", err));
  };

  const handleEditClick = (index) => {
    const diseaseToEdit = diseases[index];
    setEditIndex(index);
    setEditData(diseaseToEdit);
    setOriginalData(diseaseToEdit); // Save original
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const isChanged = () => {
    return (
      editData.disease !== originalData.disease ||
      editData.description !== originalData.description ||
      editData.learnmore !== originalData.learnmore
    );
  };

  const handleSave = () => {
    axios
      .put(
        `http://localhost:5000/admin/updatedisease/${editData._id}`,
        editData
      )
      .then(() => {
        const updatedList = [...diseases];
        updatedList[editIndex] = editData;
        setDiseases(updatedList);
        setEditIndex(null);
        setOriginalData(null);
        alert("Treatment updated successfully");
      })
      .catch(() => alert("Failed to update"));
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5000/admin/deletedisease/${deleteId}`)
      .then(() => {
        setDiseases(diseases.filter((d) => d._id !== deleteId));
        setShowConfirmDelete(false);
        alert("Deleted successfully");
      })
      .catch(() => alert("Delete failed"));
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">
        {" "}
        <Link
          to="/admin-dashboard"
          className="bi bi-arrow-left-circle"
        ></Link>{" "}
        All Treatments
      </h2>
      <div className="row">
        {diseases.map((item, index) => (
          <div className="col-md-6 col-lg-4 mb-4" key={item._id}>
            <Card className="h-100 shadow">
              <Card.Body>
                {editIndex === index ? (
                  <>
                    <Form.Group className="mb-2">
                      <Form.Label>Disease</Form.Label>
                      <Form.Control
                        name="disease"
                        value={editData.disease}
                        onChange={handleEditChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="description"
                        value={editData.description}
                        onChange={handleEditChange}
                        rows={3}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Learn More (URL)</Form.Label>
                      <Form.Control
                        name="learnmore"
                        value={editData.learnmore}
                        onChange={handleEditChange}
                      />
                    </Form.Group>
                    <div className="d-flex justify-content-between">
                      <Button
                        variant="success"
                        onClick={handleSave}
                        disabled={!isChanged()}
                      >
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditIndex(null);
                          setOriginalData(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h5 className="text-primary">{item.disease}</h5>
                    <p
                      className="text-muted"
                      style={{ height: "80px", overflowY: "auto" }}
                    >
                      {item.description}
                    </p>
                    {item.learnmore && (
                      <a
                        href={item.learnmore}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Learn More
                      </a>
                    )}
                    <div className="d-flex justify-content-between mt-3">
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleEditClick(index)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => confirmDelete(item._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      {/* Delete confirmation modal */}
      <Modal
        show={showConfirmDelete}
        onHide={() => setShowConfirmDelete(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this treatment?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmDelete(false)}
          >
            Cancel
          </Button>
          <Button className="mt-3" variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
