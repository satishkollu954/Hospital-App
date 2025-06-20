import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminLogin.css"; // Custom styles (optional)
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const AdminLogin = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [cookie, setCookie] = useCookies(["email"]);

  const handleChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        loginData
      );
      // console.log("======", loginData);
      // console.log(loginData.email);
      if (res.data.success) {
        setCookie("email", loginData.email, { path: "/" });
        alert("Login successful!");
        navigate("/admin-dashboard"); // or wherever your dashboard is
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed. Check credentials.");
    }
  };

  return (
    <div className="admin-login-bg d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow-lg admin-login-card">
        <h3 className="text-center mb-4">Admin Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              required
              placeholder="Enter admin email"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
