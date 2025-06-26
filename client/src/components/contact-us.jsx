import { useState, useEffect } from "react";
import axios from "axios";
import "./contact-us.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ContactUs() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    message: "",
  });

  const [faqList, setFaqList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const faqsPerPage = 5;

  // Fetch FAQs from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/faq")
      .then((res) => setFaqList(res.data))
      .catch((err) => {
        console.error("Failed to fetch FAQs:", err);
        setFaqList([]);
      });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/api/contactus", formData)
      .then(() => {
        toast.success("Message submitted successfully!");
        setFormData({
          fullName: "",
          email: "",
          contact: "",
          message: "",
        });
      })
      .catch((err) => {
        toast.error("Something went wrong. Please try again.");
        console.error(err);
      });
  };

  // Pagination logic
  const totalPages = Math.ceil(faqList.length / faqsPerPage);
  const indexOfLastFaq = currentPage * faqsPerPage;
  const indexOfFirstFaq = indexOfLastFaq - faqsPerPage;
  const currentFaqs = faqList.slice(indexOfFirstFaq, indexOfLastFaq);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="contact-bg d-flex align-items-center justify-content-center py-5">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="contact-card card shadow-lg p-4">
        <h2 className="text-center mb-4 text-primary">Contact Us</h2>
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person-fill"></i>
              </span>
              <input
                type="text"
                className="form-control"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope-fill"></i>
              </span>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Contact */}
          <div className="mb-3">
            <label htmlFor="contact" className="form-label">
              Contact Number
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-telephone-fill"></i>
              </span>
              <input
                type="tel"
                className="form-control"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                placeholder="Enter your contact number"
              />
            </div>
          </div>

          {/* Message */}
          <div className="mb-4">
            <label htmlFor="message" className="form-label">
              Your Message
            </label>
            <textarea
              className="form-control"
              id="message"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Type your message here..."
            ></textarea>
          </div>

          {/* Submit */}
          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-lg">
              <i className="bi bi-send-fill me-2"></i> Send Message
            </button>
          </div>
        </form>

        {/* FAQ Section */}
        <div className="mt-5">
          <h4 className="text-primary mb-3">Frequently Asked Questions</h4>
          <div className="accordion" id="faqAccordion">
            {currentFaqs.map((faq, index) => {
              const globalIndex = indexOfFirstFaq + index;
              return (
                <div className="accordion-item" key={globalIndex}>
                  <h2 className="accordion-header" id={`heading${globalIndex}`}>
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${globalIndex}`}
                      aria-expanded="false"
                      aria-controls={`collapse${globalIndex}`}
                    >
                      {faq.question}
                    </button>
                  </h2>
                  <div
                    id={`collapse${globalIndex}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`heading${globalIndex}`}
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">{faq.answer}</div>
                  </div>
                </div>
              );
            })}

            {faqList.length === 0 && (
              <p className="text-muted">No FAQs available.</p>
            )}
          </div>

          {/* Pagination Controls */}
          {faqList.length > faqsPerPage && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <button
                className="btn btn-outline-primary"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
              >
                &laquo; Previous
              </button>
              <span className="text-muted">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-outline-primary"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next &raquo;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
