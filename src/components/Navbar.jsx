
import { NavLink, Link, useNavigate } from "react-router-dom";
import "../App.css";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="site-header">
      <nav className="site-navbar" aria-label="Main navigation">
        <div className="navbar-container">
          <Link
            to="/"
            className="navbar-brand"
            aria-label="Sabre Flight Booking home"
          >
            <span className="navbar-brand-icon">✈</span>
            <span className="navbar-brand-name">Sabre</span>
            <span className="navbar-brand-divider" />
            <span className="navbar-brand-caption">Flight Booking</span>
          </Link>

          <div className="navbar-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `navbar-link${isActive ? " active" : ""}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/search"
              className={({ isActive }) =>
                `navbar-link${isActive ? " active" : ""}`
              }
            >
              Search
            </NavLink>

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `navbar-link${isActive ? " active" : ""}`
              }
            >
              Test
            </NavLink>

            <button
              type="button"
              className="navbar-cta"
              onClick={() => navigate("/search")}
            >
              <span>Get started</span>
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;