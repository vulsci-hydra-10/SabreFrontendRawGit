import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchFlights } from "../services/api";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import "../App.css";

function SearchForm() {
  const navigate = useNavigate();

  const [tripType, setTripType] = useState("oneway");
  const [origin, setOrigin] = useState("SIN");
  const [destination, setDestination] = useState("SYD");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!origin || !destination || !departureDate) {
      setError("Please fill in origin, destination, and departure date.");
      return;
    }

    if (origin.trim().toUpperCase() === destination.trim().toUpperCase()) {
      setError("Origin and destination cannot be the same.");
      return;
    }

    if (tripType === "roundtrip" && !returnDate) {
      setError("Please select a return date for round trip.");
      return;
    }

    if (tripType === "roundtrip" && returnDate < departureDate) {
      setError("Return date cannot be earlier than departure date.");
      return;
    }

    setLoading(true);

    try {
      const searchParams = {
        tripType,
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departureDate,
        returnDate: tripType === "roundtrip" ? returnDate : null,
        adults,
        children,
        infants,
      };

      const results = await searchFlights(searchParams);
      navigate("/results", { state: { results, searchParams } });
    } catch (err) {
      setError(err.message || "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const quantityOptions = (max = 9) =>
    Array.from({ length: max + 1 }, (_, i) => (
      <option key={i} value={i}>
        {i}
      </option>
    ));

  const totalPassengers = adults + children + infants;

  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const minDate = today.toISOString().split("T")[0];

  return (
    <main className="flight-search-page">
      {/* ── Banner ── */}
      
      <Hero />

      {/* ── Search card ── */}
      <section className="search-content">
        <div className="search-card">
          <div className="search-card-heading">
            <div>
              <span className="search-section-kicker">FLIGHT SEARCH</span>
              <h2>Where would you like to go?</h2>
              <p>Enter your journey details to explore available flights.</p>
            </div>

            <div className="search-heading-icon" aria-hidden="true">
              ✈
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flight-form">
            {/* Trip type */}
            <fieldset className="trip-selector">
              <legend className="field-label">Trip type</legend>

              <div className="trip-options">
                <label
                  className={`trip-option ${
                    tripType === "oneway" ? "selected" : ""
                  }`}
                >
                  <span className="input-icon" aria-hidden="true">
                    <img 
                      src="/site/essentials/one-way-trip.png" 
                      alt="" 
                      style={{ width: "1.5rem", height: "1.5rem", objectFit: "contain", verticalAlign: "middle" }} 
                    />
                  </span>
                  <input
                    type="radio"
                    name="tripType"
                    value="oneway"
                    checked={tripType === "oneway"}
                    onChange={(e) => setTripType(e.target.value)}
                  />
                  <span className="trip-radio-mark" />
                  <span>One way</span>
                </label>

                <label
                  className={`trip-option ${
                    tripType === "roundtrip" ? "selected" : ""
                  }`}
                >
                  <span className="input-icon" aria-hidden="true">
                    <img 
                      src="/site/essentials/round-trip.png" 
                      alt="" 
                      style={{ width: "1.5rem", height: "1.5rem", objectFit: "contain", verticalAlign: "middle" }} 
                    />
                  </span>
                  <input
                    type="radio"
                    name="tripType"
                    value="roundtrip"
                    checked={tripType === "roundtrip"}
                    onChange={(e) => setTripType(e.target.value)}
                  />
                  <span className="trip-radio-mark" />
                  <span>Round trip</span>
                </label>
              </div>
            </fieldset>

            {/* Error */}
            {error && (
              <div className="search-error" role="alert">
                <span className="error-symbol" aria-hidden="true">
                  !
                </span>
                <span>{error}</span>
              </div>
            )}

            {/* Section 01 — Route */}
            <div className="form-section">
              <div className="form-section-title">
                <span className="section-number">01</span>
                <h3>Your route</h3>
              </div>

              <div className="route-grid">
                <div className="form-field">
                  <label htmlFor="flight-origin" className="field-label">
                    From
                  </label>
                  <div className="input-shell">
                    <span className="input-icon" aria-hidden="true">
                      <img 
                        src="/site/essentials/takeoff.png" 
                        alt="" 
                        style={{ width: "3rem", height: "3rem", objectFit: "contain", verticalAlign: "middle" }} 
                      />
                    </span>
                    <input
                      id="flight-origin"
                      type="text"
                      value={origin}
                      onChange={(e) =>
                        setOrigin(e.target.value.toUpperCase())
                      }
                      placeholder="e.g. ATQ"
                      maxLength={3}
                      minLength={3}
                      pattern="[A-Za-z]{3}"
                      title="Enter a valid three-letter airport code."
                      autoCapitalize="characters"
                      autoComplete="off"
                      spellCheck="false"
                      required
                      className="form-control airport-input"
                    />
                  </div>
                  <span className="field-hint">Origin airport code</span>
                </div>

                <div className="route-connector" aria-hidden="true">
                  <span>⇄</span>
                </div>

                <div className="form-field">
                  <label
                    htmlFor="flight-destination"
                    className="field-label"
                  >
                    To
                  </label>
                  <div className="input-shell">
                    <span className="input-icon" aria-hidden="true">
                      <img 
                        src="/site/essentials/landing.png" 
                        alt="" 
                        style={{ width: "3rem", height: "3rem", objectFit: "contain", verticalAlign: "middle" }} 
                      />
                    </span>
                    <input
                      id="flight-destination"
                      type="text"
                      value={destination}
                      onChange={(e) =>
                        setDestination(e.target.value.toUpperCase())
                      }
                      placeholder="e.g. DXB"
                      maxLength={3}
                      minLength={3}
                      pattern="[A-Za-z]{3}"
                      title="Enter a valid three-letter airport code."
                      autoCapitalize="characters"
                      autoComplete="off"
                      spellCheck="false"
                      required
                      className="form-control airport-input"
                    />
                  </div>
                  <span className="field-hint">
                    Destination airport code
                  </span>
                </div>
              </div>
            </div>

            {/* Section 02 — Dates */}
            <div className="form-section">
              <div className="form-section-title">
                <span className="section-number">02</span>
                <h3>When are you travelling?</h3>
              </div>

              <div
                className={`date-grid ${
                  tripType === "oneway" ? "single-date" : ""
                }`}
              >
                <div className="form-field">
                  <label htmlFor="departure-date" className="field-label">
                    Departure
                  </label>
                  <input
                    id="departure-date"
                    type="date"
                    value={departureDate}
                    min={minDate}
                    onChange={(e) => {
                      setDepartureDate(e.target.value);

                      if (returnDate && e.target.value > returnDate) {
                        setReturnDate("");
                      }
                    }}
                    required
                    className="form-control"
                  />
                </div>

                {tripType === "roundtrip" && (
                  <div className="form-field">
                    <label htmlFor="return-date" className="field-label">
                      Return
                    </label>
                    <input
                    id="return-date"
                    type="date"
                    value={returnDate}
                    min={departureDate || minDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    required
                    className="form-control"
                  />
                  </div>
                )}
              </div>
            </div>

            {/* Section 03 — Passengers */}
            <div className="form-section passenger-section">
              <div className="form-section-title">
                <span className="section-number">03</span>
                <div>
                  <h3>Who's travelling?</h3>
                  <p className="section-description">
                    Select the number of passengers.
                  </p>
                </div>

                <span className="passenger-total">
                  {totalPassengers}{" "}
                  {totalPassengers === 1 ? "traveller" : "travellers"}
                </span>
              </div>

              <div className="passenger-grid">
                <div className="passenger-field">
                  <div className="passenger-label">
                    <span className="passenger-icon" aria-hidden="true">
                      ♙
                    </span>
                    <div>
                      <label htmlFor="adults">Adults</label>
                      <span>Age 12+</span>
                    </div>
                  </div>

                  <select
                    id="adults"
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="form-control passenger-select"
                  >
                    {Array.from({ length: 9 }, (_, i) => i + 1).map(
                      (count) => (
                        <option key={count} value={count}>
                          {count}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="passenger-field">
                  <div className="passenger-label">
                    <span className="passenger-icon" aria-hidden="true">
                      ♧
                    </span>
                    <div>
                      <label htmlFor="children">Children</label>
                      <span>Ages 2–11</span>
                    </div>
                  </div>

                  <select
                    id="children"
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="form-control passenger-select"
                  >
                    {quantityOptions(9)}
                  </select>
                </div>

                <div className="passenger-field">
                  <div className="passenger-label">
                    <span className="passenger-icon" aria-hidden="true">
                      ♡
                    </span>
                    <div>
                      <label htmlFor="infants">Infants</label>
                      <span>Under 2</span>
                    </div>
                  </div>

                  <select
                    id="infants"
                    value={infants}
                    onChange={(e) => setInfants(Number(e.target.value))}
                    className="form-control passenger-select"
                  >
                    {quantityOptions(9)}
                  </select>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="search-submit-area">
              <button
                type="submit"
                disabled={loading}
                className="search-submit-button"
              >
                {loading ? (
                  <>
                    <span className="search-spinner" />
                    Searching flights…
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">⌕</span>
                    Search available flights
                    <span className="submit-arrow" aria-hidden="true">
                      →
                    </span>
                  </>
                )}
              </button>

              <p className="search-submit-note">
                <span aria-hidden="true">✓</span>
                Search available options for your selected journey.
              </p>
            </div>
          </form>
        </div>

        {/* Help tip */}
        <div className="search-help">
          <span className="help-icon" aria-hidden="true">
            i
          </span>
          <p>
            <strong>Travel tip</strong>{" "}
            Use three-letter IATA airport codes, such as DEL for Delhi, SIN
            for Singapore, or LHR for London Heathrow.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default SearchForm;