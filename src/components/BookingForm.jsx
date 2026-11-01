import { useState, useEffect  } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Hero from "../components/Hero";
import "../App.css";

/* ═══════════════════════════════════════
   STATIC DATA
   ═══════════════════════════════════════ */

const COUNTRIES = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AR", name: "Argentina" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BE", name: "Belgium" },
  { code: "BR", name: "Brazil" },
  { code: "KH", name: "Cambodia" },
  { code: "CA", name: "Canada" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "HR", name: "Croatia" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "EG", name: "Egypt" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "GR", name: "Greece" },
  { code: "HK", name: "Hong Kong" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KW", name: "Kuwait" },
  { code: "LA", name: "Laos" },
  { code: "LB", name: "Lebanon" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "MX", name: "Mexico" },
  { code: "MM", name: "Myanmar" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" },
  { code: "NG", name: "Nigeria" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SG", name: "Singapore" },
  { code: "ZA", name: "South Africa" },
  { code: "KR", name: "South Korea" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "TW", name: "Taiwan" },
  { code: "TH", name: "Thailand" },
  { code: "TR", name: "Turkey" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "UY", name: "Uruguay" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VN", name: "Vietnam" },
];

const GENDER_OPTIONS = {
  ADT: ["Male", "Female", "Other"],
  CNN: ["Male", "Female"],
  INF: ["Male", "Female"],
};

const WHEELCHAIR_OPTIONS = ["No", "Yes"];

/* ═══════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════ */

function paxLabel(type) {
  return type === "ADT" ? "Adult" : type === "CNN" ? "Child" : "Infant";
}

function fmtPrice(n) {
  return (Number(n) || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/* ═══════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════ */

function BookingForm() {
  const location = useLocation();
  const navigate = useNavigate();

    useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant", });
    }, [location.key]);
    
  const searchParams = location.state?.searchParams;
  const { flight, pricing, segments, apiType, flightIndex } =
    location.state || {};

  /* ── Build passenger list from pricing ── */
  const paxList = [];
  (pricing || []).forEach((p) => {
    (p.passengers || []).forEach((px) => {
      const count = px.passengerNumber || 1;
      for (let i = 1; i <= count; i++) {
        paxList.push({ type: px.passengerType, seq: i });
      }
    });
  });

  /* ── Form state ── */
  const [passengers, setPassengers] = useState(
    paxList.map((p) => ({
      type: p.type,
      seq: p.seq,
      gender: "",
      lastName: "",
      firstName: "",
      dob: "",
      nationality: "",
      wheelchair: "No",
      passportNo: "",
      passportExpiry: "",
      issuedAt: "",
    }))
  );

  //  STATES FOR CONTACT INFO, TERMS CHECKBOX, FLIGHT SUMMARY FOR MOBILE DEVICES AND WALLET
  const [emails, setEmails] = useState(["agent1@example.com"]);
  const [contactNumber, setContactNumber] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [address, setAddress] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [walletBalance, setWalletBalance] = useState(50000);
  const [showFlightSummary, setShowFlightSummary] = useState(false);

  /* ── Updaters ── */
  const updatePax = (idx, field, value) => {
    setPassengers((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const addEmail = () => {
    if (emails.length < 5) setEmails((prev) => [...prev, ""]);
  };

  const removeEmail = (idx) => {
    setEmails((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateEmail = (idx, value) => {
    setEmails((prev) => {
      const copy = [...prev];
      copy[idx] = value;
      return copy;
    });
  };

  const refreshWallet = () => {
    /* placeholder — replace with real API call */
    setWalletBalance(50000);
  };

  const resetForm = () => {
    setPassengers(
      paxList.map((p) => ({
        type: p.type,
        seq: p.seq,
        gender: "",
        lastName: "",
        firstName: "",
        dob: "",
        nationality: "",
        wheelchair: "No",
        passportNo: "",
        passportExpiry: "",
        issuedAt: "",
      }))
    );
    setEmails(["agent1@example.com"]);
    setContactNumber("");
    setContactEmail("");
    setAddress("");
    setAgreeTerms(false);
  };

  const issueTicket = () => {
    if (!agreeTerms) {
      alert("Please agree to Terms and Conditions.");
      return;
    }
    /* placeholder — integrate with PNR API */
    alert("Ticket issue — not yet connected to API.");
  };

  /* ── Flight summary helpers ── */
  const segs = segments || [];
  const firstSeg = segs[0] || {};
  const lastSeg = segs[segs.length - 1] || {};
  const mainPricing = (pricing || [])[0] || {};
  const mainCurrency = mainPricing.currency || "USD";
  const mainTotal = mainPricing.totalPrice || 0;

  /* ═══════════════════════════════════════
     RENDER
     ═══════════════════════════════════════ */

  return (
    <main className="flight-results-page">
      <Hero searchParams={searchParams} />
        <div className="bf-page">
            {/* ── Top bar ── */}
            <div className="bf-topbar">
                <button className="bf-back" onClick={() => navigate(-1)}>
                ← Back
                </button>
                <span className="bf-topbar-title">Booking Form</span>
                {/* <span className="bf-topbar-route">
                {firstSeg.departureAirport || "—"} → {lastSeg.arrivalAirport || "—"}
                </span> */}
                <button
                  className="bf-summary-toggle"
                  onClick={() => setShowFlightSummary(true)}
                  type="button"
                >
                  Flight Summary
                </button>
            </div>

                <div className="bf-body">
                    {/* ════════ LEFT COLUMN ════════ */}
                    <div className="bf-main">
                    {/* ── Passenger sections ── */}
                    {passengers.map((pax, idx) => (
                        <div key={idx} className="bf-pax-section">
                        <div className="bf-pax-title">
                            {paxLabel(pax.type)} × {pax.seq}
                        </div>

                        <div className="bf-pax-grid">
                            {/* Gender */}
                            <div className="bf-field">
                            <label>Gender</label>
                            <select className="bf-select" value={pax.gender} onChange={(e) => updatePax(idx, "gender", e.target.value) } >
                                <option value="">Select</option>
                                {(GENDER_OPTIONS[pax.type] || GENDER_OPTIONS.ADT).map(
                                (g) => (
                                    <option key={g} value={g}>
                                    {g}
                                    </option>
                                )
                                )}
                            </select>
                            </div>

                            {/* Last Name */}
                            <div className="bf-field">
                            <label>Last Name</label>
                            <input className="bf-input" type="text" placeholder="Last name" value={pax.lastName} onChange={(e) => updatePax(idx, "lastName", e.target.value) } />
                            </div>

                            {/* First Name */}
                            <div className="bf-field">
                            <label>First Name</label>
                            <input className="bf-input" type="text" placeholder="First name" value={pax.firstName} onChange={(e) => updatePax(idx, "firstName", e.target.value) } />
                            </div>

                            {/* DOB */}
                            <div className="bf-field">
                            <label>Date of Birth</label>
                            <input className="bf-date" type="date" value={pax.dob} onChange={(e) => updatePax(idx, "dob", e.target.value)} />
                            </div>

                            {/* Nationality */}
                            <div className="bf-field">
                            <label>Nationality</label>
                            <select className="bf-select" value={pax.nationality} onChange={(e) => updatePax(idx, "nationality", e.target.value) } >
                                <option value="">Select</option>
                                {COUNTRIES.map((c) => (
                                <option key={c.code} value={c.code}>
                                    {c.name}
                                </option>
                                ))}
                            </select>
                            </div>

                            {/* Wheelchair */}
                            <div className="bf-field">
                            <label>Wheelchair</label>
                            <select className="bf-select" value={pax.wheelchair} onChange={(e) => updatePax(idx, "wheelchair", e.target.value) } >
                                {WHEELCHAIR_OPTIONS.map((w) => (
                                <option key={w} value={w}>
                                    {w}
                                </option>
                                ))}
                            </select>
                            </div>

                            {/* Passport No */}
                            <div className="bf-field">
                            <label>Passport No</label>
                            <input className="bf-input" type="text" placeholder="Passport number" value={pax.passportNo} onChange={(e) => updatePax(idx, "passportNo", e.target.value) } />
                            </div>

                            {/* Passport Expiry */}
                            <div className="bf-field">
                            <label>Passport Expiry</label>
                            <input className="bf-date" type="date" value={pax.passportExpiry} onChange={(e) => updatePax(idx, "passportExpiry", e.target.value) } />
                            </div>

                            {/* Issued At */}
                            <div className="bf-field">
                            <label>Issued At</label>
                            <select className="bf-select" value={pax.issuedAt} onChange={(e) => updatePax(idx, "issuedAt", e.target.value) } >
                                <option value="">Select</option>
                                {COUNTRIES.map((c) => (
                                <option key={c.code} value={c.code}>
                                    {c.name}
                                </option>
                                ))}
                            </select>
                            </div>
                        </div>
                        </div>
                    ))}

                    {/* ── Contact Information ── */}
                    <div className="bf-contact-section">
                        <div className="bf-contact-title">Contact Information</div>
                        <p className="bf-contact-desc">
                        Your ticket and flight information will be sent here.
                        </p>

                        <div className="bf-contact-grid">
                        {/* Emails */}
                        <div className="bf-field bf-field-full">
                            <label>Email Addresses</label>
                            <div className="bf-email-list">
                            {emails.map((em, ei) => (
                                <div key={ei} className="bf-email-row">
                                <input className="bf-input" type="email" placeholder="email@example.com" value={em} onChange={(e) => updateEmail(ei, e.target.value)} />
                                {emails.length > 1 && (
                                    <button className="bf-email-remove" onClick={() => removeEmail(ei)} type="button" >
                                    ✕
                                    </button>
                                )}
                                </div>
                            ))}
                            {emails.length < 5 && (
                                <button className="bf-email-add" onClick={addEmail} type="button" >
                                + Add Email
                                </button>
                            )}
                            </div>
                        </div>

                        {/* Contact Number */}
                        <div className="bf-field">
                            <label>Contact Number</label>
                            <input className="bf-input" type="tel" placeholder="+91 ..." value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
                        </div>

                        {/* Contact Email */}
                        <div className="bf-field">
                            <label>Contact Email</label>
                            <input className="bf-input" type="email" placeholder="contact@example.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                        </div>

                        {/* Address */}
                        <div className="bf-field bf-field-full">
                            <label>Address</label>
                            <textarea className="bf-textarea" rows={3} placeholder="Street, City, State, ZIP" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>
                        </div>
                    </div>
                    </div>

                    {/* ════════ RIGHT SIDEBAR ════════ */}
                    <div className="bf-sidebar">
                    {/* ── Flight summary ── */}
                    {/* <div className="bf-summary-card"> */}
                        <div className={`bf-summary-card ${showFlightSummary ? "bf-summary-open" : ""}`}>

                            <div className="bf-summary-mobile-header">
                              {/* <h3>Flight Summary</h3> */}

                              <button
                                type="button"
                                onClick={() => setShowFlightSummary(false)}
                              >
                                ✕
                              </button>
                            </div>

                        <div className="bf-summary-title">Flight Summary</div>
                        <div className="bf-summary-row">
                        {/* <span>Route</span>
                        <span>
                            {firstSeg.departureAirport || "—"} →{" "}
                            {lastSeg.arrivalAirport || "—"}
                        </span> */}
                        </div>
                        {firstSeg.departureTime && (
                        <div className="bf-summary-row">
                            <span>Departure</span>
                            <span>{firstSeg.departureTime}</span>
                        </div>
                        )}
                        {firstSeg.marketingAirline && (
                        <div className="bf-summary-row">
                            <span>Airline</span>
                            <span>
                            {firstSeg.marketingAirline} {firstSeg.flightNumber}
                            </span>
                        </div>
                        )}
                        <div className="bf-summary-row bf-summary-total">
                        <span>Total</span>
                        <span>
                            {mainCurrency} {fmtPrice(mainTotal)}
                        </span>
                        </div>

                        {/* Per-pax price */}
                        {(mainPricing.passengers || []).map((px, i) => {
                        const pBase =
                            px.equivAmount != null
                            ? px.equivAmount
                            : px.baseFareAmount || 0;
                        const pTax = px.totalTaxAmount || 0;
                        const pCount = px.passengerNumber || 1;
                        const pTotal = (pBase + pTax) * pCount;
                        return (
                            <div key={i} className="bf-summary-pax">
                            <span>
                                {paxLabel(px.passengerType)}
                                {pCount > 1 ? ` × ${pCount}` : ""}
                            </span>
                            <span>
                                {mainCurrency} {fmtPrice(pTotal)}
                            </span>
                            </div>
                        );
                        })}
                    </div>

                    {/* ── Wallet Balance ── */}
                    <div className="bf-wallet">
                        <span className="bf-wallet-label">Wallet Balance</span>
                        <span className="bf-wallet-value">
                        ₹ {fmtPrice(walletBalance)}
                        </span>
                        <button className="bf-wallet-refresh" onClick={refreshWallet} type="button" title="Refresh balance" >
                        ↻
                        </button>
                    </div>

                    {/* ── Add Meal / Add Baggage ── */}
                    <div className="bf-extras">
                        <button className="bf-extra-btn" type="button">
                        🍽️ Add Meal
                        </button>
                        <button className="bf-extra-btn" type="button">
                        🧳 Add Baggage
                        </button>
                    </div>

                    {/* ── Terms ── */}
                    <label className="bf-terms">
                        <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
                        <span>I agree to Terms and Conditions</span>
                    </label>

                    {/* ── Action buttons ── */}
                    <div className="bf-actions">
                        <button className="bf-btn-reset" type="button" onClick={resetForm} >
                        Reset
                        </button>
                        <button className="bf-btn-issue" type="button" onClick={issueTicket} >
                        Issue Ticket
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
}

export default BookingForm;