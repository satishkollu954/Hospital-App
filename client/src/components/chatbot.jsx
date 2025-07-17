import React, { useState } from "react";
import "./chatbot.css";
import { MdChatBubbleOutline } from "react-icons/md"; // Chat icon
import { IoMdClose } from "react-icons/io"; // Close icon

const sampleFAQs = [
  {
    question: "working hours",
    answer: "We are open 9 AM to 5 PM, Monday to Saturday.",
  },
  {
    question: "appointment",
    answer: "Visit the Appointment page to book one.",
  },
  {
    question: "location",
    answer:
      "We are located in Hyderabad, Chennai, Bangalore, Mumbai, and Delhi.",
  },
  {
    question: "emergency",
    answer: "For emergencies, please call our 24/7 helpline at +91-9600012345.",
  },
  {
    question: "available doctors",
    answer: "You can view all available doctors on the 'Appointment' page.",
  },
  {
    question: "specializations",
    answer:
      "We offer treatments in Cardiology, Orthopedics, Pediatrics, and more.",
  },
  {
    question: "contact number",
    answer: "You can reach us at +91-9600012345.",
  },
  {
    question: "do you accept insurance",
    answer: "Yes, we accept most major health insurance providers.",
  },
  {
    question: "how to cancel appointment",
    answer: "You can cancel your appointment by calling our helpline.",
  },
  {
    question: "doctors availability",
    answer:
      "Doctors are available based on their schedules. Check the Appointment page for more details.",
  },
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const matched = sampleFAQs.find((faq) =>
      input.toLowerCase().includes(faq.question.toLowerCase())
    );

    const botReply = matched
      ? matched.answer
      : "Sorry, I couldn't understand. Please contact us directly.";

    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    }, 800);

    setInput("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setInput(""); // Clear input field
    setMessages([{ from: "bot", text: "Hi! How can I help you today?" }]); // Reset messages
  };

  return (
    <>
      <div className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <IoMdClose size={24} color="#fff" />
        ) : (
          <MdChatBubbleOutline size={24} color="#fff" />
        )}
      </div>

      {isOpen && (
        <div className="chatbot-popup">
          <div className="chat-header d-flex justify-content-between align-items-center">
            <strong>Ask RaagviCare</strong>
            <IoMdClose
              size={22}
              style={{ cursor: "pointer" }}
              onClick={handleClose}
            />
          </div>
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.from}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              placeholder="Type your question..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
