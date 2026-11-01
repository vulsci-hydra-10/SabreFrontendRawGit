
import { useLocation, useNavigate, Link } from "react-router-dom";
import TotalFlightCount from "../components/TotalFlightCount";
import FlightCard from "../components/FlightCard";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import "../App.css";

function FlightResults() {
  const location = useLocation();
  const navigate = useNavigate();

  const results = location.state?.results;
  const searchParams = location.state?.searchParams;

  if (!results) {
    return (
      <div className="results-state-page">
        <div className="results-state-card">
          <div className="results-state-icon">✈</div>
          <h2>No search results yet</h2>
          <p>Enter your travel details to discover available flights.</p>
          <Link to="/search" className="results-primary-link">
            Search Flights
          </Link>
        </div>
      </div>
    );
  }

  if (!results.success) {
    return (
      <div className="results-state-page">
        <div className="results-state-card">
          <div className="results-state-icon error-icon">!</div>
          <h2>We couldn't find your flights</h2>
          <p className="results-error-message">
            {results.message ||
              (typeof results.error === "string"
                ? results.error
                : JSON.stringify(results.error) || "Please try again.")}
          </p>
          <button
            className="results-primary-button"
            onClick={() => navigate("/search")}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const flights = Array.isArray(results.flights)
    ? results.flights
    : [];

  return (
    <main className="flight-results-page">

      <Hero searchParams={searchParams} />

      <section className="results-content">

        <div className="results-content-filters-area">
          <div className="results-content-heading">
            <div>
              <span className="results-eyebrow results-eyebrow-light">
                AVAILABLE OPTIONS
              </span>
              <h2>Flight results</h2>
            </div>
          </div>
          <div className="results-filter-item">
            <label htmlFor="sort-select">Sort by:</label>
            <select id="sort-select" className="results-sort-select">
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="duration-asc">Duration: Shortest</option>
              <option value="duration-desc">Duration: Longest</option>
            </select>
          </div>
        </div>
        <TotalFlightCount totalFlights={flights.length} />

        {flights.length > 0 ? (
          <div className="results-flight-list">
            {flights.map((flight, index) => (
              <FlightCard
                key={flight.id || flight.flightId || index}
                flight={flight}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="results-empty">
            <div className="results-empty-icon">✈</div>
            <h3>No flights available</h3>
            <p>
              There are no flights available for this route and date.
              Try changing your travel dates or destination.
            </p>
            <button
              className="results-primary-button"
              onClick={() => navigate("/search")}
            >
              Change Search
            </button>
          </div>
        )}

        <div className="results-bottom-action">
          <button
            className="results-back-button"
            onClick={() => navigate("/search")}
          >
            <span>←</span> Start a New Search
          </button>
          <span className="results-bottom-note">
            Your next adventure is just a flight away.
          </span>
        </div>
      </section>
    </main>
  );
}

export default FlightResults;

