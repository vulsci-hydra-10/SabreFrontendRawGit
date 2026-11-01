import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

import TotalFlightCount from "../components/TotalFlightCount";
import GetAirlineNames from "../components/GetAirlineForFilter";
import FlightCard from "../components/FlightCard";
import Hero from "../components/Hero";
import "../App.css";

// Calculate the total price of a flight.
// Keep this consistent with FlightCard.jsx.
function getFlightTotalPrice(flight) {
  const pricing = Array.isArray(flight.pricing)
    ? flight.pricing
    : [];

  return pricing.reduce((sum, p) => {
    return (
      sum +
      (parseFloat(p.totalPrice) || 0) *
        (parseInt(p.passengerQty, 10) || 1)
    );
  }, 0);
}

function FlightResults() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.key]);

  const results = location.state?.results;
  const searchParams = location.state?.searchParams;
  const ApiType = results?.APItype || "#Unknown";

  // Declare flights before using them.
  const flights =
    results?.success && Array.isArray(results.flights)
      ? results.flights
      : [];

  // Calculate the price of each flight.
  const pricedFlights = flights
    .map((flight) => ({
      flight,
      totalPrice: getFlightTotalPrice(flight),
    }))
    .filter(({ totalPrice }) => totalPrice > 0);

  // Find the cheapest and most expensive flight.
  const minPrice = pricedFlights.length
    ? Math.min(
        ...pricedFlights.map((item) => item.totalPrice)
      )
    : 0;

  const maxPrice = pricedFlights.length
    ? Math.max(
        ...pricedFlights.map((item) => item.totalPrice)
      )
    : 0;

  // GET AIRLINE CAREERS.
  const airlineCodes = [
    ...new Set(
      flights.flatMap((flight) =>
        (flight.validatingCarrier || [])
          .map((carrier) => carrier.validatingCarrier)
          .filter(Boolean)
      )
    )
  ];

  // null means the full price range is selected.
  const [price, setPrice] = useState(null);
  // const [selectedAirline, setSelectedAirline] = useState("all");
  // const [selectedStops, setSelectedStops] = useState("any");
  const [selectedAirlines, setSelectedAirlines] = useState([]);

  // ── NEW: mobile filter sidebar open / closed ──
  const [filterOpen, setFilterOpen] = useState(false);

  const maxSelectedPrice = price ?? maxPrice;

  // Filter flights according to the selected maximum price.
  const filteredFlights = pricedFlights
    .filter(({ totalPrice, flight }) => {
      // 1. Budget filter
      const matchesBudget = totalPrice <= maxSelectedPrice;

      // 2. Airline filter
      const matchesAirline =
        selectedAirlines.length === 0 ||
        (flight.validatingCarrier || []).some((carrier) =>
          selectedAirlines.includes(carrier.validatingCarrier)
        );
      // Both filters must match
      return matchesBudget && matchesAirline;
    })
    .map(({ flight }) => flight);

  // ── NEW: count active filters for the mobile badge ──
  const activeFilterCount =
    (price !== null ? 1 : 0) + selectedAirlines.length;

  // No search results yet.
  if (!results) {
    return (
      <div className="results-state-page">
        <div className="results-state-card">
          <div className="results-state-icon">✈</div>
          <h2>No search results yet</h2>
          <p>
            Enter your travel details to discover available flights.
          </p>
          <Link to="/search" className="results-primary-link">
            Search Flights
          </Link>
        </div>
      </div>
    );
  }

  // API returned an error.
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

  // Reset all filters.
  const resetFilters = () => {
    setPrice(null);
    setSelectedAirlines([]);
    // setSelectedAirline("all");
    // setSelectedStops("any");
  };

  return (
    <main className="flight-results-page">
      <Hero searchParams={searchParams} />

      <section className="results-content">
        {/* ── NEW: mobile filter toggle bar (only visible ≤ 700px) ── */}
        <div className="mobile-filter-bar">
          <button
            type="button"
            className="mobile-filter-toggle"
            onClick={() => setFilterOpen(true)}
          >
            <span className="mobile-filter-toggle-icon" aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
                <circle cx="9" cy="6" r="2.4" fill="currentColor" stroke="none" />
                <circle cx="15" cy="12" r="2.4" fill="currentColor" stroke="none" />
                <circle cx="7" cy="18" r="2.4" fill="currentColor" stroke="none" />
              </svg>
            </span>
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="mobile-filter-badge">{activeFilterCount}</span>
            )}
          </button>
        </div>

        {/* ── NEW: backdrop shown when sidebar is open ── */}
        <div
          className={`filter-backdrop ${filterOpen ? "backdrop-visible" : ""}`}
          onClick={() => setFilterOpen(false)}
        />

        <div className="results-layout">
          <aside
            className={`results-sidebar ${filterOpen ? "sidebar-open" : ""}`}
          >
            <div className="filter-header">
              <h2>Flights</h2>
              <div className="filter-header-actions">
                <button
                  type="button"
                  className="clear-filters"
                  onClick={resetFilters}
                >
                  Reset
                </button>
                {/* ── NEW: close button (mobile only) ── */}
                <button
                  type="button"
                  className="filter-close-btn"
                  onClick={() => setFilterOpen(false)}
                  aria-label="Close filters"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="results-content-heading">
              <span className="results-eyebrow results-eyebrow-light">
                <TotalFlightCount totalFlights={filteredFlights.length} />
              </span>
            </div>

            {/* Dynamic price filter */}
            <div className="filter-group">
              <h3>Budget</h3>
              <div className="price-labels">
                <span>₹{minPrice.toLocaleString("en-IN")}</span>
                <strong>₹{maxSelectedPrice.toLocaleString("en-IN")}</strong>
              </div>

              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                step="1"
                value={maxSelectedPrice}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="price-slider"
                aria-label="Maximum ticket price"
                disabled={pricedFlights.length === 0 || minPrice === maxPrice}
              />

              <div className="range-hints">
                <span>Cheapest: ₹{minPrice.toLocaleString("en-IN")}</span>
                <span>Costliest: ₹{maxPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* AIRLINE NAMES */}
            <div className="filter-by-airline">
              <span>
                <GetAirlineNames
                  airlineCodes={airlineCodes}
                  selectedAirlines={selectedAirlines}
                  onSelectionChange={setSelectedAirlines}
                />
              </span>
            </div>

            {/* ── NEW: mobile apply button (closes the panel) ── */}
            <button
              type="button"
              className="mobile-apply-btn"
              onClick={() => setFilterOpen(false)}
            >
              Show {filteredFlights.length} Flights
            </button>
          </aside>

          <div className="rest-canvus">
            {filteredFlights.length > 0 ? (
              <div className="results-flight-list">
                {filteredFlights.map((flight, index) => (
                  <FlightCard
                    key={flight.id || flight.flightId || index}
                    flight={flight}
                    index={index}
                    apiType={ApiType}
                  />
                ))}
              </div>
            ) : (
              <div className="results-empty">
                <div className="results-empty-icon">✈</div>

                <h3>
                  {flights.length === 0
                    ? "No flights available"
                    : "No flights within this budget"}
                </h3>

                <p>
                  {flights.length === 0
                    ? "No flights were returned for this search. Try changing your travel dates or destination."
                    : "No flights with a valid price are available within your selected budget. Increase the budget or reset your filters."}
                </p>

                <button
                  className="results-primary-button"
                  onClick={() => {
                    setPrice(null);
                  }}
                >
                  Show All Flights
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
          </div>
        </div>
      </section>
    </main>
  );
}

export default FlightResults;
