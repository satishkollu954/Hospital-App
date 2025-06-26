import { useState } from "react";
import axios from "axios";
import "./contact-us.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ContactUs() {
  const faqList = [
    {
      question: "What medicine should I take for fever?",
      answer:
        "You can take Paracetamol (e.g., Crocin, Dolo 650) every 6 hours. Stay hydrated and rest.",
    },
    {
      question: "How do I treat a common cold?",
      answer:
        "For cold, use Cetirizine for runny nose and steam inhalation. Drink warm fluids.",
    },
    {
      question: "What to take for headache?",
      answer:
        "Paracetamol or ibuprofen helps relieve headache. If persistent, consult a doctor.",
    },
    {
      question: "What to do in case of stomach ache?",
      answer:
        "Take antacids or pain relief like Meftal-Spas. Avoid spicy foods.",
    },
    {
      question: "How to manage body pain?",
      answer:
        "Painkillers like Dolo 650 or Ibuprofen are helpful. Warm compress can also reduce pain.",
    },
    {
      question: "What medicine helps in cough?",
      answer:
        "Cough syrups like Benadryl or Ascoril can be used. Drink warm honey-lemon water.",
    },
  ];

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //toast.info("Submitting your message...");

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

  return (
    <div className="contact-bg d-flex align-items-center justify-content-center py-5">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="contact-card card shadow-lg p-4">
        <h2 className="text-center mb-4 text-primary">Contact Us</h2>
        <form onSubmit={handleSubmit}>
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

          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-lg">
              <i className="bi bi-send-fill me-2"></i> Send Message
            </button>
          </div>
        </form>

        <div className="mt-5">
          <h4 className="text-primary mb-3">Frequently Asked Questions</h4>
          <div className="accordion" id="faqAccordion">
            {faqList.map((faq, index) => (
              <div className="accordion-item" key={index}>
                <h2 className="accordion-header" id={`heading${index}`}>
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${index}`}
                    aria-expanded="false"
                    aria-controls={`collapse${index}`}
                  >
                    {faq.question}
                  </button>
                </h2>
                <div
                  id={`collapse${index}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading${index}`}
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">{faq.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
