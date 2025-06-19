import { Link } from "react-router-dom";
import "./about.css";

export function About() {
  return (
    <div>
      <div className="container-fluid about-bg">
        <div className="title">
          RaagviCare : <span className="inner-titile">About Us</span>{" "}
        </div>
        <span className="sub-title">
          Advanced Treatment. Expert Care. Extraordinary Results.
        </span>
      </div>{" "}
      <br />
      <div className="description">
        <div className="fs-4 fw-bold">
          {" "}
          <Link
            to="/"
            className="text-primary fw-normal pe-2 text-decoration-none"
          >
            Home »
          </Link>
          About RaagviCare
        </div>
        Welcome to RaagviCare, your trusted partner in health and healing. At
        RaagviCare, we believe that healthcare is not just about advanced
        treatments — it’s about caring for people with compassion, dignity, and
        commitment. Our hospital combines state-of-the-art medical technology
        with a deep-rooted passion for patient-centric care, ensuring every
        patient feels supported, respected, and understood. <br /> <br />
        <b>» What We Offer:</b> Comprehensive Medical Services: From routine
        check-ups to complex surgeries, our services cover a wide spectrum of
        healthcare needs. Experienced and Dedicated Team: Our doctors, nurses,
        and specialists are not only highly qualified but deeply empathetic —
        ensuring you’re treated like family. Modern Infrastructure: Equipped
        with advanced diagnostic tools, modular operation theatres, intensive
        care units, and more — designed to deliver world-class outcomes.
        Patient-Centered Approach: Every treatment plan is tailored to the
        patient’s condition, lifestyle, and preferences. We listen first — then
        act with care. Emergency & Critical Care: Our 24/7 emergency unit is
        always ready, equipped to respond swiftly with life-saving
        interventions. Holistic Well-being: At RaagviCare, we care for the mind,
        body, and soul. Our wellness programs, physiotherapy, counseling, and
        follow-up care make healing complete. <br />
        <br />» Our Mission To deliver{" "}
        <b>accessible, affordable, and advanced healthcare</b> that improves
        lives — while maintaining the highest ethical standards and
        compassionate practices. <br />
        <br />» Why Choose RaagviCare? Because your health deserves{" "}
        <b>
          more than treatment — it deserves care, trust, and human connection.
        </b>{" "}
        That’s the RaagviCare promise.
      </div>
      <br />
      <div className="d-flex justify-content-center btm-title">
        Your health is our priority.
      </div>
    </div>
  );
}
