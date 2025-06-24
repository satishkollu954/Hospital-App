import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    await axios
      .post("http://localhost:5000/doctor/send-otp", { Email: email })
      .then(() => {
        alert("OTP sent to email.");
      })
      .catch(() => alert("Failed to send OTP."));
    alert("OTP sent to email.");
    setOtpSent(true);
  };

  function handleSubmit(e) {
    e.preventDefault();

    axios
      .post("http://localhost:5000/doctor/update-password", {
        Email: email,
        Otp: otp,
        newPassword: newPassword,
      })
      .then((res) => {
        if (res.data.success) {
          console.log("updated successs");
          navigate("/login");
        }
      });
  }

  return (
    <div className="container-fluid vh-90 d-flex justify-content-center align-items-center">
      <div
        className="border p-4 rounded shadow w-100"
        style={{ maxWidth: "400px" }}
      >
        <h4 className="mb-3 text-center">Forget Password</h4>
        <form>
          <dl>
            <dt>Email</dt>
            <dd>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </dd>

            <dd>
              <button className="btn btn-warning w-100" onClick={handleSendOtp}>
                Send OTP
              </button>
            </dd>

            {otpSent && (
              <>
                <dt>Enter OTP</dt>
                <dd>
                  <input
                    type="text"
                    className="form-control"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </dd>
                <dt>New Password</dt>
                <dd>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </dd>
              </>
            )}
          </dl>
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-primary w-100"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
