import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import SearchModal from "../components/SearchModal";
import "../HeroCloudyAnim.css";

function HeroCloudyAnim({ searchParams }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [modalOpen, setModalOpen] = useState(false);

    const origin = searchParams?.origin || "Origin";
    const destination = searchParams?.destination || "Destination";
    const isRoundTrip = searchParams?.tripType === "roundtrip";

    // ── Helper: get full day name from a date string ──
    const getDayName = (dateStr) => {
        if (!dateStr || dateStr === "Not specified") return "";
        try {
            const date = new Date(dateStr + "T00:00:00");
            if (isNaN(date.getTime())) return "";
            return date.toLocaleDateString("en-US", { weekday: "short" });
        } catch {
            return "";
        }
    };

    // ── Helper: format date with day ──
    const formatDateWithDay = (dateStr) => {
        if (!dateStr || dateStr === "Not specified") return "Not specified";
        const dayName = getDayName(dateStr);
        return dayName ? `${dateStr}` : dateStr;
    };

    const departureDay = getDayName(searchParams?.departureDate);
    const returnDay = getDayName(searchParams?.returnDate);

    return (
        <section className="results-hero">
            {/* Animated dark sky background */}
            <div className="sky-animation" aria-hidden="true">
                <div className="sky-stars">
                    {Array.from({ length: 35 }, (_, i) => (
                        <span
                            key={i}
                            className="sky-star"
                            style={{
                                "--x": `${(i * 37 + 11) % 100}%`,
                                "--y": `${(i * 23 + 7) % 65}%`,
                                "--delay": `${(i % 9) * -0.7}s`,
                                "--size": `${(i % 3) + 1}px`,
                            }}
                        />
                    ))}
                </div>

                <div className="moon-glow" />

                <div className="cloud-layer cloud-layer-back">
                    <div className="cloud cloud-one" />
                    <div className="cloud cloud-two" />
                    <div className="cloud cloud-three" />
                </div>

                <div className="air-traffic" aria-hidden="true">
                    <div className="flight-path plane-one">
                        <span className="flight-trail" />
                        <span className="flying-plane">✈</span>
                    </div>
                    <div className="flight-path plane-two">
                        <span className="flight-trail" />
                        <span className="flying-plane">✈</span>
                    </div>
                    <div className="flight-path plane-three">
                        <span className="flight-trail" />
                        <span className="flying-plane">✈</span>
                    </div>
                    <div className="flight-path plane-four">
                        <span className="flight-trail" />
                        <span className="flying-plane">✈</span>
                    </div>
                    <div className="flight-path plane-five">
                        <span className="flight-trail" />
                        <span className="flying-plane">✈</span>
                    </div>
                </div>

                <div className="cloud-layer cloud-layer-front">
                    <div className="cloud cloud-four" />
                    <div className="cloud cloud-five" />
                    <div className="cloud cloud-six" />
                </div>

                <div className="sky-horizon" />
            </div>

            <Navbar />

            <div className="results-hero-inner">
                <div className="results-heading-row">
                    <div>
                        <span className="results-eyebrow">
                            YOUR NEXT JOURNEY STARTS HERE
                        </span>
                        <h1>Find your perfect flight<span>.</span></h1>
                        <p className="results-heading-description">
                            Compare available flights and choose the journey
                            that works best for you.
                        </p>
                    </div>

                    <div className="action-nd-step">
                        {location.pathname !== "/booking" && (
                        <button
                            className="results-edit-search"
                            onClick={() => setModalOpen(true)}
                        >
                            <span>✎</span> Edit Search
                        </button>
                        )}

                        {/* <div className="results-breadcrumb">
                            <Link to="/">Home</Link>
                            <span>/</span>
                            <span>Flight Results</span>
                        </div> */}
                    </div>
                </div>

                <div className="route-summary-card">
                    {/* ── ONWARD SECTOR ── */}
                    <div className="route-summary-main">
                        <div className="route-airport">
                            <span className="route-label">FROM</span>
                            <strong>{origin}</strong>
                            <span className="route-caption">Departure airport</span>
                        </div>

                        <div className="route-visual">
                            <span className="route-line" />
                            <span className="route-plane">✈</span>
                            <span className="route-type">
                                {isRoundTrip ? "OUTBOUND" : "ONE WAY"}
                            </span>
                        </div>

                        <div className="route-airport route-destination">
                            <span className="route-label">TO</span>
                            <strong>{destination}</strong>
                            <span className="route-caption">Arrival airport</span>
                        </div>
                    </div>

                    {/* ── RETURN SECTOR (only for round trip) ── */}
                    {isRoundTrip && (
                        <>
                            <div className="route-summary-divider" />
                            <div className="route-summary-main route-summary-return">
                                <div className="route-airport">
                                    <span className="route-label">FROM</span>
                                    <strong>{destination}</strong>
                                    <span className="route-caption">Return departure</span>
                                </div>

                                <div className="route-visual">
                                    <span className="route-line" />
                                    <span className="route-plane" style={{transform: "rotate(180deg)"}}>✈</span>
                                    <span className="route-type">RETURN</span>
                                </div>

                                <div className="route-airport route-destination">
                                    <span className="route-label">TO</span>
                                    <strong>{origin}</strong>
                                    <span className="route-caption">Return arrival</span>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="route-summary-divider" />

                    <div className="route-details">
                        <div className="route-detail-item">
                            <span className="route-detail-icon">▦</span>
                            <div>
                                <span className="route-detail-label">DEPARTURE</span>
                                <strong>{departureDay}, {formatDateWithDay(searchParams?.departureDate)}</strong>
                                {/* {departureDay && (
                                  <span className="route-detail-day">{departureDay}</span>
                                )} */}
                            </div>
                        </div>

                        {isRoundTrip && (
                            <div className="route-detail-item">
                                <span className="route-detail-icon">↩</span>
                                <div>
                                    <span className="route-detail-label">RETURN</span>
                                    <strong>{returnDay}, {formatDateWithDay(searchParams?.returnDate)}</strong>
                                    {/* {returnDay && (
                                        <span className="route-detail-day">{returnDay}</span>
                                    )} */}
                                </div>
                            </div>
                        )}

                        <div className="route-detail-item">
                            <span className="route-detail-icon">♙</span>
                            <div>
                                <span className="route-detail-label">TRAVELLERS</span>
                                <strong>
                                    {(Number(searchParams?.adults) || 0)} Adult
                                    {(Number(searchParams?.adults) || 0) !== 1 ? "s" : ""}
                                    {Number(searchParams?.children) > 0
                                        ? `, ${searchParams.children} Child${Number(searchParams.children) !== 1 ? "ren" : ""}`
                                        : ""}
                                    {Number(searchParams?.infants) > 0
                                        ? `, ${searchParams.infants} Infant${Number(searchParams.infants) !== 1 ? "s" : ""}`
                                        : ""}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Search Modal ── */}
            <SearchModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                initialParams={searchParams}
            />
        </section>
    );
}

export default HeroCloudyAnim;