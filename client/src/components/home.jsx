import { Link } from "react-router-dom";
import "./home.css";

export function Home() {
  function handleMouseover(e) {
    e.target.stop();
  }
  function handleMouseOut(e) {
    e.target.start();
  }

  return (
    <div className="home-wrapper">
      <div className="home-top">
        <div className="justify-content-center align-items-center mb-4">
          Delivering leading-edge <br />
          medical care, with compassion.
        </div>
        <div>
          <Link
            to="appointment"
            className="text-white fw-bold px-3 py-2 rounded mt-3 d-inline-block text-decoration-none boxshadow border-0"
            style={{ cursor: "pointer" }}
          >
            Book an Appointment <span className="ms-2">&rarr;</span>
          </Link>
        </div>
      </div>{" "}
      <br />
      <div className="bg-text d-flex justify-content-center">
        Discover What Makes Us Different
      </div>
      <br />
      <div className="home-bottom fs-6">
        <div className="home-bottom-left">
          <p>
            <b>
              At our hospital, we combine advanced medical technology with a
              deep commitment to compassionate care. What sets us apart isn't
              just our expertise — it's how we treat every patient like family.
            </b>
          </p>
          <p>
            <b>» Patient-Centered Approach:</b> We listen, we understand, and we
            tailor care based on individual needs.
          </p>
          <p>
            <b> » Expert Medical Team:</b> Our board-certified doctors,
            experienced nurses, and skilled technicians deliver world-class
            care.
          </p>
          <p>
            <b>» State-of-the-Art Facilities:</b> Modern equipment, advanced
            diagnostics, and clean, healing environments.
          </p>
          <p>
            <b> » 24/7 Emergency Support:</b> We’re always ready when you need
            us the most.
          </p>
          <p>
            <b> » Holistic Care:</b> From prevention and diagnosis to recovery
            and support, we care for your complete well-being.
          </p>
        </div>

        <div className="home-bottom-right">
          <img src="/home-bottom-img.jpg" alt="Hospital Care" />
        </div>
      </div>{" "}
      <br />
      <div className="dotted-image">
        <div className="bg-text d-flex justify-content-center pt-4">
          What Our Patients Say About Us!
        </div>{" "}
        <br />
        <div className="container">
          <div
            id="reviewCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src="review-1.jpg"
                  className="d-block w-100"
                  alt="Review 1"
                  height="350"
                />
              </div>
              <div className="carousel-item">
                <img
                  src="review-2.jpg"
                  className="d-block w-100"
                  alt="Review 2"
                  height="350"
                />
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#reviewCarousel"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#reviewCarousel"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
