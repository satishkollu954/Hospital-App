import React, { useEffect, useState } from "react";
import axios from "axios";
import "./addChatbotQuestions.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

export default function ChatbotAdmin() {
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({ question: "", answer: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [originalData, setOriginalData] = useState({
    question: "",
    answer: "",
  });
  const [isModified, setIsModified] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchQuestions = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/chatbot");
      setQuestions(data);
    } catch (err) {
      toast.error("Failed to fetch questions");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:5000/api/chatbot/${editId}`,
          formData
        );
        toast.success("Updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/chatbot", formData);
        toast.success("Added successfully");
      }

      setFormData({ question: "", answer: "" });
      setIsEditing(false);
      setEditId(null);
      fetchQuestions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving question");
    }
  };

  const handleEdit = (q) => {
    setFormData({ question: q.question, answer: q.answer });
    setOriginalData({ question: q.question, answer: q.answer }); // store original
    setIsEditing(true);
    setEditId(q._id);
  };

  useEffect(() => {
    if (isEditing) {
      const changed =
        formData.question !== originalData.question ||
        formData.answer !== originalData.answer;
      setIsModified(changed);
    }
  }, [formData, originalData, isEditing]);

  const confirmDeleteChatbotQuestion = (id) => {
    setDeleteId(id);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/chatbot/${deleteId}`);
      toast.success("Deleted successfully");
      fetchQuestions();
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setShowConfirmModal(false);
      setDeleteId(null);
    }
  };

  const handleCancel = () => {
    setFormData({ question: "", answer: "" });
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div className="container mt-2 chatbot-admin">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="mb-3">
        {" "}
        <Link
          to="/admin-dashboard"
          className="bi bi-arrow-left-circle fs-3 me-2"
        ></Link>
        Manage Chatbot Q&A
      </h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Question</label>
          <input
            type="text"
            className="form-control"
            name="question"
            value={formData.question}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Answer</label>
          <textarea
            className="form-control"
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            rows="3"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-success me-2"
          disabled={isEditing && !isModified}
        >
          {isEditing ? "Update" : "Add"}
        </button>
        {isEditing && (
          <button
            type="button"
            className="btn btn-secondary mb-3"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
      </form>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Question</th>
            <th>Answer</th>
            <th style={{ width: "150px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">
                No questions available
              </td>
            </tr>
          ) : (
            questions.map((q) => (
              <tr key={q._id}>
                <td>{q.question}</td>
                <td>{q.answer}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(q)}
                  >
                    Edit
                  </button>
                  <button
                    className="bi bi-trash btn btn-sm btn-danger mb-2"
                    onClick={() => confirmDeleteChatbotQuestion(q._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {showConfirmModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this question?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger mt-3"
                  onClick={() => handleDelete(deleteId)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
