import "./App.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Home } from "./components/home";
import { About } from "./components/about-us";
import { Treatment } from "./components/treatments";
import { ContactUs } from "./components/contact-us";
import { Appointment } from "./components/appointment";
import { Doctors } from "./components/doctors";
import { Location } from "./components/locations";
import { AdminLogin } from "./components/AdminLogin";
import { AdminDashboard } from "./components/admindashboard";
import { AddLocation } from "./components/AddLocation";
import { ProtectRoute } from "./components/protectroute";
import { AddDoctors } from "./components/addDoctors";
import { AllQueries } from "./components/AllQueries";
import { DoctorProfile } from "./components/doctorProfile";
import { ForgetPassword } from "./components/forgetPassword";
import { AddDiseases } from "./components/AddDiseases";
import { DoctorDashboard } from "./components/doctorDashboard";
import { ALLDoctors } from "./components/viewAllDoctors";
import { ALLDiseases } from "./components/viewAllDiseases";
import { ALLLocations } from "./components/viewAllLocations";
import { ViewAppointments } from "./components/viewappointments";

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        {/* Header */}
        <header className="bg-color text-white py-1 shadow-sm">
          <div className="container-fluid d-flex justify-content-between align-items-center px-4">
            <div className="d-flex align-items-start">
              <a href="https://raagvitech.com/">
                {" "}
                <img
                  src="/logo3.webp"
                  alt="Hospital Logo"
                  style={{ height: "70px", marginRight: "50px" }}
                />
              </a>
            </div>
            <h1 className="text-center me-5 fs-1 flex-grow-1 d-none d-md-block">
              RaagviCare
            </h1>
            {/* <nav className="d-flex justify-content-end">
              <Link
                to="appointment"
                className="text-white fw-bold px-3 py-2 rounded mt-2 d-inline-block text-decoration-none boxshadow border-0"
                style={{ cursor: "pointer" }}
              >
                Book an Appointment <span className="ms-2">&rarr;</span>
              </Link>
            </nav> */}
          </div>
          <div className="container-fluid pb-0 px-4">
            <nav className="d-flex ms-4 justify-content-center">
              <ul className="nav">
                <li className="nav-item">
                  <Link to="/" className="nav-link text-white">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/about" className="nav-link text-white">
                    About Us
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/treatments" className="nav-link text-white">
                    Treatments
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/doctors" className="nav-link text-white">
                    Doctors
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/contact" className="nav-link text-white">
                    Contact Us
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/location" className="nav-link text-white">
                    Location
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-grow-1 container-fluid py-4 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="treatments" element={<Treatment />} />
            <Route path="appointment" element={<Appointment />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="location" element={<Location />} />
            <Route path="login" element={<AdminLogin />} />
            <Route
              path="all-locations"
              element={
                <ProtectRoute>
                  <ALLLocations />
                </ProtectRoute>
              }
            />
            <Route
              path="all-diseases"
              element={
                <ProtectRoute>
                  <ALLDiseases />
                </ProtectRoute>
              }
            />
            <Route
              path="all-doctors"
              element={
                <ProtectRoute>
                  <ALLDoctors />
                </ProtectRoute>
              }
            />
            <Route
              path="doctor-profile"
              element={
                <ProtectRoute>
                  <DoctorProfile />
                </ProtectRoute>
              }
            />
            <Route
              path="doctor-appointments"
              element={
                <ProtectRoute>
                  <ViewAppointments />
                </ProtectRoute>
              }
            />
            <Route path="forgetPassword" element={<ForgetPassword />} />
            <Route
              path="add-disease"
              element={
                <ProtectRoute>
                  <AddDiseases />
                </ProtectRoute>
              }
            />

            <Route
              path="doctor-dashboard"
              element={
                <ProtectRoute>
                  <DoctorDashboard />
                </ProtectRoute>
              }
            />

            <Route
              path="admin-dashboard"
              element={
                <ProtectRoute>
                  <AdminDashboard />
                </ProtectRoute>
              }
            />
            <Route
              path="add-location"
              element={
                <ProtectRoute>
                  <AddLocation />
                </ProtectRoute>
              }
            />
            <Route
              path="add-doctor"
              element={
                <ProtectRoute>
                  <AddDoctors />
                </ProtectRoute>
              }
            />
            <Route
              path="queries"
              element={
                <ProtectRoute>
                  <AllQueries />
                </ProtectRoute>
              }
            />
            <Route
              path="*"
              element={
                <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
                  <h1 className="display-4 text-danger">404</h1>
                  <h3>Looking for something?</h3>
                  <p className="text-muted">
                    We are sorry, the page you requested could not be found.
                  </p>
                  <a href="/" className="btn btn-primary mt-3">
                    Go to Home
                  </a>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-footer text-white py-4 mt-auto">
          <div className="container-fluid text-center px-4">
            <p className="mb-1">
              &copy; {new Date().getFullYear()} RaagviCare. All rights reserved.
            </p>
            <p className="mb-2">
              Providing quality care for a healthier future.
            </p>
            <div>
              <a href="https://raagvitech.com/" className="text-white mx-2">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://raagvitech.com/" className="text-white mx-2">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="https://raagvitech.com/" className="text-white mx-2">
                <i className="bi bi-instagram"></i>
              </a>
              <a
                href="https://www.linkedin.com/company/raagvitech/posts/?feedView=all"
                className="text-white mx-2"
              >
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
