import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";          // ← add this
import { searchFlights } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../SearchModal.css";

function SearchModal({ isOpen, onClose, initialParams }) {
  const navigate = useNavigate();
  const overlayRef = useRef(null);
  const firstInputRef = useRef(null);

  const [form, setForm] = useState({
    origin: "SIN",
    destination: "SYD",
    tripType: "oneway",
    departureDate: "",
    returnDate: "",
    adults: 1,
    children: 0,
    infants: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ── Prefill when modal opens ── */
  useEffect(() => {
    if (isOpen && initialParams) {
      setForm({
        origin: initialParams.origin || "SIN",
        destination: initialParams.destination || "SYD",
        tripType: initialParams.tripType || "oneway",
        departureDate: initialParams.departureDate || "",
        returnDate: initialParams.returnDate || "",
        adults: Number(initialParams.adults) || 1,
        children: Number(initialParams.children) || 0,
        infants: Number(initialParams.infants) || 0,
      });
      setError("");
    }
  }, [isOpen, initialParams]);

  /* ── Focus first input on open ── */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 120);
    }
  }, [isOpen]);

  /* ── Close on Escape ── */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  /* ── Lock body scroll while open ── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const adjustTraveller = (field, delta) => {
    setForm((prev) => {
      const next = Math.max(field === "adults" ? 1 : 0, prev[field] + delta);
      return { ...prev, [field]: next };
    });
  };

  const swapAirports = () =>
    setForm((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));

  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const minDate = today.toISOString().split("T")[0];

  const isRoundTrip = form.tripType === "roundtrip";
  const totalPassengers = form.adults + form.children + form.infants;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.origin || !form.destination || !form.departureDate) {
      setError("Please fill in origin, destination, and departure date.");
      return;
    }
    if (form.origin.trim().toUpperCase() === form.destination.trim().toUpperCase()) {
      setError("Origin and destination cannot be the same.");
      return;
    }
    if (isRoundTrip && !form.returnDate) {
      setError("Please select a return date for round trip.");
      return;
    }
    if (isRoundTrip && form.returnDate < form.departureDate) {
      setError("Return date cannot be earlier than departure date.");
      return;
    }

    setLoading(true);
    try {
      const searchParams = {
        tripType: form.tripType,
        origin: form.origin.toUpperCase(),
        destination: form.destination.toUpperCase(),
        departureDate: form.departureDate,
        returnDate: isRoundTrip ? form.returnDate : null,
        adults: form.adults,
        children: form.children,
        infants: form.infants,
      };
      const results = await searchFlights(searchParams);
      onClose();
      navigate("/results", { state: { results, searchParams } });
    } catch (err) {
      setError(err.message || "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── If not open, render nothing ── */
  if (!isOpen) return null;

  /* ── The modal JSX ── */
  const modalUI = (
    <div
      className="sm-overlay"
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="sm-modal" role="dialog" aria-modal="true">
        {/* ── Header ── */}
        <div className="sm-header">
          <div className="sm-header-left">
            <span className="sm-header-icon">
              <img
                src="/site/essentials/one-way-trip.png"
                alt=""
                style={{ width: "1.1rem", height: "1.1rem", objectFit: "contain" }}
              />
            </span>
            <h2>Edit Search</h2>
          </div>
          <button className="sm-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="sm-form" noValidate>
          {/* ── Trip type toggle ── */}
          <div className="sm-trip-toggle">
            <button
              type="button"
              className={`sm-toggle-btn ${!isRoundTrip ? "active" : ""}`}
              onClick={() => update("tripType", "oneway")}
            >
              <img src="/site/essentials/one-way-trip.png" alt="" style={{ width: "1.25rem", height: "1.25rem", objectFit: "contain", filter: "brightness(0) invert(1)"  }}/>
              One Way
            </button>
            <button
              type="button"
              className={`sm-toggle-btn ${isRoundTrip ? "active" : ""}`}
              onClick={() => update("tripType", "roundtrip")}
            >
              <img src="/site/essentials/round-trip.png" alt="" style={{ width: "1.25rem", height: "1.25rem", objectFit: "contain", filter: "brightness(0) invert(1)"  }}/>
              Round Trip
            </button>
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="sm-error" role="alert">
              <span className="sm-error-symbol" aria-hidden="true">!</span>
              <span>{error}</span>
            </div>
          )}

          {/* ── Airports ── */}
          <div className="sm-section-label">
            <span className="sm-section-num">01</span>
            <span>Your route</span>
          </div>
          <div className="sm-airports-row">
            <div className="sm-field sm-field-airport">
              <label htmlFor="sm-origin">From</label>
              <div className="sm-input-icon-wrap">
                <span className="sm-input-icon">
                  <img src="/site/essentials/takeoff.png" alt="" style={{ width: "1.4rem", height: "1.4rem", objectFit: "contain" }}/>
                </span>
                <input
                  id="sm-origin"
                  ref={firstInputRef}
                  type="text"
                  placeholder="e.g. SIN"
                  value={form.origin}
                  onChange={(e) => update("origin", e.target.value.toUpperCase())}
                  maxLength={3} minLength={3} pattern="[A-Za-z]{3}"
                  autoCapitalize="characters" autoComplete="off" spellCheck="false"
                  required
                />
              </div>
              <span className="sm-field-hint">Origin airport code</span>
            </div>

            <button type="button" className="sm-swap-btn" onClick={swapAirports} aria-label="Swap origin and destination">⇄</button>

            <div className="sm-field sm-field-airport">
              <label htmlFor="sm-dest">To</label>
              <div className="sm-input-icon-wrap">
                <span className="sm-input-icon">
                  <img src="/site/essentials/landing.png" alt="" style={{ width: "1.4rem", height: "1.4rem", objectFit: "contain" }}/>
                </span>
                <input
                  id="sm-dest"
                  type="text"
                  placeholder="e.g. SYD"
                  value={form.destination}
                  onChange={(e) => update("destination", e.target.value.toUpperCase())}
                  maxLength={3} minLength={3} pattern="[A-Za-z]{3}"
                  autoCapitalize="characters" autoComplete="off" spellCheck="false"
                  required
                />
              </div>
              <span className="sm-field-hint">Destination airport code</span>
            </div>
          </div>

          {/* ── Dates ── */}
          <div className="sm-section-label">
            <span className="sm-section-num">02</span>
            <span>When are you travelling?</span>
          </div>
          <div className={`sm-dates-row ${isRoundTrip ? "dual" : "single"}`}>
            <div className="sm-field">
              <label htmlFor="sm-dep">Departure</label>
              <div className="sm-input-icon-wrap">
                <span className="sm-input-icon">📅</span>
                <input
                  id="sm-dep"
                  type="date"
                  value={form.departureDate}
                  min={minDate}
                  onChange={(e) => {
                    update("departureDate", e.target.value);
                    if (form.returnDate && e.target.value > form.returnDate) {
                      update("returnDate", "");
                    }
                  }}
                  required
                />
              </div>
            </div>
            {isRoundTrip && (
              <div className="sm-field">
                <label htmlFor="sm-ret">Return</label>
                <div className="sm-input-icon-wrap">
                  <span className="sm-input-icon">📅</span>
                  <input
                    id="sm-ret"
                    type="date"
                    value={form.returnDate}
                    min={form.departureDate || minDate}
                    onChange={(e) => update("returnDate", e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── Travellers ── */}
          <div className="sm-section-label">
            <span className="sm-section-num">03</span>
            <span>Who's travelling?</span>
            <span className="sm-passenger-total">
              {totalPassengers} {totalPassengers === 1 ? "traveller" : "travellers"}
            </span>
          </div>
          <div className="sm-travellers-row">
            {[
              { key: "adults", label: "Adults", sub: "Age 12+", icon: "♙" },
              { key: "children", label: "Children", sub: "Ages 2–11", icon: "♧" },
              { key: "infants", label: "Infants", sub: "Under 2", icon: "♡" },
            ].map(({ key, label, sub, icon }) => (
              <div className="sm-counter" key={key}>
                <div className="sm-counter-label">
                  <span className="sm-counter-icon" aria-hidden="true">{icon}</span>
                  <div>
                    <span>{label}</span>
                    <small>{sub}</small>
                  </div>
                </div>
                <div className="sm-counter-controls">
                  <button type="button" className="sm-counter-btn" onClick={() => adjustTraveller(key, -1)} disabled={form[key] <= (key === "adults" ? 1 : 0)}>−</button>
                  <span className="sm-counter-value">{form[key]}</span>
                  <button type="button" className="sm-counter-btn" onClick={() => adjustTraveller(key, 1)} disabled={form[key] >= 9}>+</button>
                </div>
              </div>
            ))}
          </div>

          {/* ── Actions ── */}
          <div className="sm-actions">
            <button type="button" className="sm-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="sm-btn-search" disabled={loading}>
              {loading ? (
                <><span className="sm-spinner"/> Searching…</>
              ) : (
                <><span>⌕</span> Search Flights <span className="sm-submit-arrow" aria-hidden="true">→</span></>
              )}
            </button>
          </div>
          <p className="sm-submit-note">
            <span aria-hidden="true">✓</span> Search available options for your selected journey.
          </p>
        </form>
      </div>
    </div>
  );

  /* ── Portal: renders at document.body, outside ALL parent stacking contexts ── */
  return createPortal(modalUI, document.body);
}

export default SearchModal;