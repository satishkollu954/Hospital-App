import React, { useState } from "react";
import "./chatbot.css";
import { MdChatBubbleOutline } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import axios from "axios";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/chatbot/answer",
        {
          params: { question: input },
        }
      );

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: data.answer || "I'm here to help!" },
        ]);
        setLoading(false);
      }, 800);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Sorry, I couldn't understand. Please contact us directly.",
        },
      ]);
      setLoading(false);
    }

    setInput("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setInput("");
    setMessages([{ from: "bot", text: "Hi! How can I help you today?" }]);
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
            {loading && (
              <div className="msg bot">
                <span className="spinner-border spinner-border-sm"></span>{" "}
                Typing...
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              placeholder="Type your question..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
