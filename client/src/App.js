import "./App.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Home } from "./components/home";
import { About } from "./components/about-us";
import { Treatment } from "./components/treatments";
import { Appointment } from "./components/appointment";

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
            <h1 className="text-center fs-1 flex-grow-1 d-none d-md-block">
              RaagviCare
            </h1>
            <nav className="d-flex justify-content-end">
              <Link
                to="appointment"
                className="text-white fw-bold px-3 py-2 rounded mt-2 d-inline-block text-decoration-none boxshadow border-0"
                style={{ cursor: "pointer" }}
              >
                Book an Appointment <span className="ms-2">&rarr;</span>
              </Link>
            </nav>
          </div>
          <div className="container-fluid pb-0 px-4">
            <nav className="d-flex me-4 justify-content-center">
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
