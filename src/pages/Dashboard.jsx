import { useState, Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function FlightCard({ flight, index, apiType }) {
  const location = useLocation();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const navigate = useNavigate();

  const searchParams = location.state?.searchParams;

  const segments = flight.segments || [];
  const pricing = flight.pricing || [];
  const isRoundTrip = flight.directionInd === "Return";

  const legs = groupLegs(segments, flight.directionInd);

  /* Grand total — pricing.totalPrice already includes all pax */
  const totalPrice = pricing.reduce(
    (sum, p) => sum + (parseFloat(p.totalPrice) || 0),
    0
  );
  const currency = pricing[0]?.currency || "USD";

  return (
    <div className="fc-card">
      {/* ── Header ── */}
      <div className="fc-header">
        <span className={`fc-dir ${isRoundTrip ? "rt" : "ow"}`}>
          {isRoundTrip ? "⟲ Round trip" : "→ One way"}
        </span>
        <span className="fc-api">{apiType}</span>
        <span className="fc-opt">Flight {index + 1}</span>
      </div>

      {/* ── Legs ── */}
      <div className="fc-root">
        <div className="fc-body">
          {legs.map((leg, li) => {
            const first = leg.segments[0];
            const last = leg.segments[leg.segments.length - 1];

            return (
              <div key={li} className="fc-leg">
                {isRoundTrip && (
                  <span
                    className={`fc-leg-tag ${
                      leg.type === "outbound" ? "out" : "ret"
                    }`}
                  >
                    {leg.type === "outbound" ? "Outbound" : "Return"}
                  </span>
                )}

                <div className="fc-route">
                  {/* Origin */}
                  <div className="fc-ep">
                    <span className="fc-ep-code">
                      {first.departureAirport}
                    </span>
                    <span className="fc-ep-time">
                      {fmtTime(getDT(first, "dep"))}
                    </span>
                    <span className="fc-ep-date">
                      {fmtDate(getDT(first, "dep"))}
                    </span>
                  </div>

                  {/* Segments + intermediate stops */}
                  {leg.segments.map((seg, si) => (
                    <Fragment key={si}>
                      <div className="fc-seg">
                        <span className="fc-seg-fl">
                          {seg.marketingAirline} {seg.flightNumber}
                        </span>
                        <div className="fc-seg-line" />
                        {seg.stopQuantity > 0 && (
                          <span className="fc-seg-stops">
                            {seg.stopQuantity} stop
                            {seg.stopQuantity > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>

                      {si < leg.segments.length - 1 ? (
                        <div className="fc-via">
                          <span className="fc-via-dot" />
                          <span className="fc-via-code">
                            {seg.arrivalAirport}
                          </span>
                          <span className="fc-via-time">
                            {fmtTime(getDT(seg, "arr"))}
                          </span>
                        </div>
                      ) : (
                        <div className="fc-ep fc-ep-dest">
                          <span className="fc-ep-code">
                            {seg.arrivalAirport}
                          </span>
                          <span className="fc-ep-time">
                            {fmtTime(getDT(seg, "arr"))}
                          </span>
                          <span className="fc-ep-date">
                            {fmtDate(getDT(seg, "arr"))}
                          </span>
                        </div>
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <button 
          className="book-ticket-button"
          onClick={() =>
            navigate("/booking", {
              state: {
                flight,
                pricing,
                segments,
                apiType,
                searchParams,
                flightIndex: index,
              },
            })
          }
        >
          <span>✎</span> Book
        </button>
      </div>

      {/* ── Footer: price + toggle ── */}
      <div className="fc-foot">
        <div className="fc-price">
          <span className="fc-price-lbl">Total</span>
          <span className="fc-price-val">
            {currency} {fmtPrice(totalPrice)}
          </span>
        </div>
        <button
          className="fc-toggle"
          type="button"
          onClick={() => setDetailsOpen((v) => !v)}
        >
          <span className="fc-toggle-arrow">
            {detailsOpen ? "▴" : "▾"}
          </span>
          {detailsOpen ? "Hide details" : "View details"}
        </button>
      </div>

      {/* ── Details dropdown (tabbed) ── */}
      {detailsOpen && (
        <DetailsPanel
          segments={segments}
          pricing={pricing}
          flight={flight}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   DETAILS PANEL — 3 tabs
   ═══════════════════════════════════════ */

function DetailsPanel({ segments, pricing, flight }) {
  const [activeTab, setActiveTab] = useState("flight");

  return (
    <div className="fc-details">
      {/* ── Tab bar ── */}
      <div className="fc-det-tabs">
        <button
          className={`fc-det-tab ${
            activeTab === "flight" ? "fc-det-tab-active" : ""
          }`}
          onClick={() => setActiveTab("flight")}
        >
          Flight Details
        </button>
        <button
          className={`fc-det-tab ${
            activeTab === "fare" ? "fc-det-tab-active" : ""
          }`}
          onClick={() => setActiveTab("fare")}
        >
          Fare Details
        </button>
        <button
          className={`fc-det-tab ${
            activeTab === "baggage" ? "fc-det-tab-active" : ""
          }`}
          onClick={() => setActiveTab("baggage")}
        >
          Baggage and Fare Rules
        </button>
      </div>

      {/* ── Tab content ── */}
      {activeTab === "flight" && (
        <FlightDetailsTab segments={segments} directionInd={flight.directionInd} />
      )}
      {activeTab === "fare" && (
        <FareDetailsTab pricing={pricing} />
      )}
      {activeTab === "baggage" && (
        <BaggageFareRulesTab pricing={pricing} segments={segments} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   TAB 1 — Flight Details (unchanged logic)
   ═══════════════════════════════════════ */

// function FlightDetailsTab({ segments }) {
//   return (
//     <div className="fc-det-section">
//       <h4 className="fc-det-title">Flight Details</h4>
//       {segments.map((seg, i) => (
//         <div key={i} className="fc-det-seg">
//           <div className="fc-det-seg-head">
//             <span className="fc-det-seg-num">Segment {i + 1}</span>
//             <span className="fc-det-seg-fl">
//               {seg.marketingAirline} {seg.flightNumber}
//             </span>
//             {seg.operatingAirline &&
//               seg.operatingAirline !== seg.marketingAirline && (
//                 <span className="fc-det-seg-op">
//                   Operated by {seg.operatingAirline}
//                 </span>
//               )}
//           </div>

//           <div className="fc-det-seg-body">
//             <div className="fc-det-point">
//               <span className="fc-det-point-label">Departure</span>
//               <span className="fc-det-point-code">
//                 {seg.departureAirport}
//               </span>
//               <span className="fc-det-point-time">
//                 {fmtTime(getDT(seg, "dep"))}
//               </span>
//               <span className="fc-det-point-date">
//                 {fmtDate(getDT(seg, "dep"))}
//               </span>
//               {seg.departureTerminal && (
//                 <span className="fc-det-point-term">
//                   Terminal {seg.departureTerminal}
//                 </span>
//               )}
//             </div>

//             <span className="fc-det-arrow">→</span>

//             <div className="fc-det-point">
//               <span className="fc-det-point-label">Arrival</span>
//               <span className="fc-det-point-code">
//                 {seg.arrivalAirport}
//               </span>
//               <span className="fc-det-point-time">
//                 {fmtTime(getDT(seg, "arr"))}
//               </span>
//               <span className="fc-det-point-date">
//                 {fmtDate(getDT(seg, "arr"))}
//               </span>
//               {seg.arrivalTerminal && (
//                 <span className="fc-det-point-term">
//                   Terminal {seg.arrivalTerminal}
//                 </span>
//               )}
//             </div>
//           </div>

//           <div className="fc-det-seg-meta">
//             {seg.stopQuantity > 0 && (
//               <span className="fc-det-stops">
//                 {seg.stopQuantity} stop
//                 {seg.stopQuantity > 1 ? "s" : ""} en route
//               </span>
//             )}
//             {seg.journeyDuration && (
//               <span className="fc-det-dur">
//                 Duration: {seg.journeyDuration}
//               </span>
//             )}
//             {seg.equipment && (
//               <span className="fc-det-equip">
//                 Aircraft: {seg.equipment}
//               </span>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

function FlightDetailsTab({ segments, directionInd }) {
  /* ── Duration formatter: minutes → "7h 55m" ── */
  const fmtDuration = (minutes) => {
    if (!minutes || minutes <= 0) return "";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m.toString().padStart(2, "0")}m`;
  };

  /* ── Full date with day name: "Sun, Nov 15, 2026" ── */
  const fmtFullDate = (s) => {
    const d = parseDT(s);
    if (d)
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    return "";
  };

  /* ── Layover in minutes between two consecutive segments ── */
  const getLayoverMinutes = (seg1, seg2) => {
    const arr = parseDT(getDT(seg1, "arr"));
    const dep = parseDT(getDT(seg2, "dep"));
    if (arr && dep) {
      const diffMs = dep - arr;
      if (diffMs > 0) return Math.round(diffMs / 60000);
    }
    return null;
  };

  /* ── Group into legs (outbound / return) ── */
  const legs = groupLegs(segments, directionInd);

  /* ── Grand total across ALL segments ── */
  const grandTotalMinutes = segments.reduce(
    (sum, seg) => sum + (seg.elapsedTime || 0),
    0
  );

  return (
    <div className="fc-det-section">
      <h4 className="fc-det-title">Flight Details</h4>

      {legs.map((leg, li) => {
        const legTotalMinutes = leg.segments.reduce(
          (s, seg) => s + (seg.elapsedTime || 0),
          0
        );

        return (
          <div key={li} className="fc-det-leg">
            {legs.length > 1 && (
              <span
                className={`fc-det-leg-tag ${
                  leg.type === "outbound" ? "out" : "ret"
                }`}
              >
                {leg.type === "outbound" ? "Outbound" : "Return"}
              </span>
            )}

            {leg.segments.map((seg, i) => {
              const layover =
                i > 0
                  ? getLayoverMinutes(leg.segments[i - 1], seg)
                  : null;
              const duration = seg.elapsedTime || 0;

              return (
                <Fragment key={i}>
                  {/* ── Layover between connecting segments ── */}
                  {layover !== null && layover > 0 && (
                    <div className="fc-det-layover">
                      <span className="fc-det-layover-line" />
                      <span className="fc-det-layover-text">
                        Layover {fmtDuration(layover)}
                      </span>
                      <span className="fc-det-layover-line" />
                    </div>
                  )}

                  <div className="fc-det-seg">
                    <div className="fc-det-seg-head">
                      <span className="fc-det-seg-num">Segment {i + 1}</span>
                      <span className="fc-det-seg-fl">
                        {seg.marketingAirline} {seg.flightNumber}
                      </span>
                      {seg.operatingAirline &&
                        seg.operatingAirline !== seg.marketingAirline && (
                          <span className="fc-det-seg-op">
                            Operated by {seg.operatingAirline}
                          </span>
                        )}
                    </div>

                    <div className="fc-det-seg-body">
                      {/* ── Departure ── */}
                      <div className="fc-det-point">
                        <span className="fc-det-point-label">Departure</span>
                        <span className="fc-det-point-code">
                          {seg.departureAirport}
                        </span>
                        <span className="fc-det-point-time">
                          {fmtTime(getDT(seg, "dep"))}
                        </span>
                        <span className="fc-det-point-date">
                          {fmtFullDate(getDT(seg, "dep"))}
                        </span>
                        {seg.departureTerminal && (
                          <span className="fc-det-point-term">
                            Terminal {seg.departureTerminal}
                          </span>
                        )}
                      </div>

                      {/* ── Duration (replaces the old "→" arrow) ── */}
                      <div className="fc-det-duration">
                        <span className="fc-det-duration-line" />
                        <span className="fc-det-duration-text">
                          {duration > 0 ? fmtDuration(duration) : ""}
                        </span>
                        <span className="fc-det-duration-line" />
                      </div>

                      {/* ── Arrival ── */}
                      <div className="fc-det-point">
                        <span className="fc-det-point-label">Arrival</span>
                        <span className="fc-det-point-code">
                          {seg.arrivalAirport}
                        </span>
                        <span className="fc-det-point-time">
                          {fmtTime(getDT(seg, "arr"))}
                        </span>
                        <span className="fc-det-point-date">
                          {fmtFullDate(getDT(seg, "arr"))}
                        </span>
                        {seg.arrivalTerminal && (
                          <span className="fc-det-point-term">
                            Terminal {seg.arrivalTerminal}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="fc-det-seg-meta">
                      {seg.stopQuantity > 0 && (
                        <span className="fc-det-stops">
                          {seg.stopQuantity} stop
                          {seg.stopQuantity > 1 ? "s" : ""} en route
                        </span>
                      )}
                      {seg.equipment && (
                        <span className="fc-det-equip">
                          Aircraft: {seg.equipment}
                        </span>
                      )}
                    </div>
                  </div>
                </Fragment>
              );
            })}

            {/* ── Per-leg total travel time ── */}
            <div className="fc-det-leg-total">
              <span className="fc-det-leg-total-label">
                {legs.length > 1
                  ? leg.type === "outbound"
                    ? "Outbound travel time"
                    : "Return travel time"
                  : "Total travel time"}
              </span>
              <strong className="fc-det-leg-total-val">
                {fmtDuration(legTotalMinutes)}
              </strong>
            </div>
          </div>
        );
      })}

      {/* ── Grand total (only when multiple legs, e.g. round trip) ── */}
      {legs.length > 1 && grandTotalMinutes > 0 && (
        <div className="fc-det-grand-total">
          <span className="fc-det-grand-total-label">Trip Total</span>
          <strong className="fc-det-grand-total-val">
            {fmtDuration(grandTotalMinutes)}
          </strong>
        </div>
      )}
    </div>
  );
}

// function FlightDetailsTab({ segments, directionInd }) {
//   /* ── Duration formatter: minutes → "7h 55m" ── */
//   const fmtDuration = (minutes) => {
//     if (!minutes || minutes <= 0) return "";
//     const h = Math.floor(minutes / 60);
//     const m = minutes % 60;
//     return `${h}h ${m.toString().padStart(2, "0")}m`;
//   };

//   /* ── Full date with day name: "Sun, Nov 15, 2026" ── */
//   const fmtFullDate = (s) => {
//     const d = parseDT(s);
//     if (d)
//       return d.toLocaleDateString("en-US", {
//         weekday: "short",
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       });
//     return "";
//   };

//   /* ── Layover in minutes between two consecutive segments ── */
//   const getLayoverMinutes = (seg1, seg2) => {
//     const arr = parseDT(getDT(seg1, "arr"));
//     const dep = parseDT(getDT(seg2, "dep"));
//     if (arr && dep) {
//       const diffMs = dep - arr;
//       if (diffMs > 0) return Math.round(diffMs / 60000);
//     }
//     return null;
//   };

//   /* ── Group into legs (outbound / return) ── */
//   const legs = groupLegs(segments, directionInd);

//   /* ── Grand total across ALL segments ── */
//   const grandTotalMinutes = segments.reduce(
//     (sum, seg) => sum + (seg.elapsedTime || 0),
//     0
//   );

//    return (
//     <>
//      <div className="fc-det-section">
//        <h4 className="fc-det-title">Flight Details</h4>
//        {segments.map((seg, i) => (
//          <div key={i} className="fc-det-seg">
//            <div className="fc-det-seg-head">
//              <span className="fc-det-seg-num">Segment {i + 1}</span>
//              <span className="fc-det-seg-fl">
//                {seg.marketingAirline} {seg.flightNumber}
//              </span>
//              {seg.operatingAirline &&
//                seg.operatingAirline !== seg.marketingAirline && (
//                  <span className="fc-det-seg-op">
//                    Operated by {seg.operatingAirline}
//                  </span>
//                )}
//            </div>

//            <div className="fc-det-seg-body">
//              <div className="fc-det-point">
//                <span className="fc-det-point-label">Departure</span>
//                <span className="fc-det-point-code">
//                  {seg.departureAirport}
//                </span>
//                <span className="fc-det-point-time">
//                  {fmtTime(getDT(seg, "dep"))}
//                </span>
//                <span className="fc-det-point-date">
//                  {fmtDate(getDT(seg, "dep"))}
//                </span>
//                {seg.departureTerminal && (
//                  <span className="fc-det-point-term">
//                    Terminal {seg.departureTerminal}
//                  </span>
//                )}
//              </div>

//              <span className="fc-det-arrow">→</span>

//              <div className="fc-det-point">
//                <span className="fc-det-point-label">Arrival</span>
//                <span className="fc-det-point-code">
//                  {seg.arrivalAirport}
//                </span>
//                <span className="fc-det-point-time">
//                  {fmtTime(getDT(seg, "arr"))}
//                </span>
//                <span className="fc-det-point-date">
//                  {fmtDate(getDT(seg, "arr"))}
//                </span>
//                {seg.arrivalTerminal && (
//                  <span className="fc-det-point-term">
//                    Terminal {seg.arrivalTerminal}
//                  </span>
//                )}
//              </div>

//                       {/* ── Duration (replaces the old "→" arrow) ── */}
//                       <div className="fc-det-duration">
//                         <span className="fc-det-duration-line" />
//                         <span className="fc-det-duration-text">
//                           {duration > 0 ? fmtDuration(duration) : ""}
//                         </span>
//                         <span className="fc-det-duration-line" />
//                       </div>
                      
//            </div>

//            <div className="fc-det-seg-meta">
//              {seg.stopQuantity > 0 && (
//                <span className="fc-det-stops">
//                  {seg.stopQuantity} stop
//                  {seg.stopQuantity > 1 ? "s" : ""} en route
//                </span>
//              )}
//              {seg.journeyDuration && (
//                <span className="fc-det-dur">
//                  Duration: {seg.journeyDuration}
//                </span>
//              )}
//              {seg.equipment && (
//                <span className="fc-det-equip">
//                  Aircraft: {seg.equipment}
//                </span>
//              )}
//            </div>
//          </div>
//        ))}
//      </div>

//         <div className="fc-det-grand-total">
//           <span className="fc-det-grand-total-label">Total Travel Time</span>
//           <strong className="fc-det-grand-total-val">
//             {fmtDuration(grandTotalMinutes)}
//           </strong>
//         </div>
//         </>
//    );
//  }




/* ═══════════════════════════════════════
   TAB 2 — Fare Details
   ═══════════════════════════════════════ */

function FareDetailsTab({ pricing }) {
  return (
    <div className="fc-det-section">
      <h4 className="fc-det-title">Fare Details</h4>

      {pricing.map((p, pi) => {
        const passengers = p.passengers || [];
        const mainCurrency = p.currency || "USD";

        /* Main-level base in equivalent currency when available */
        const mainBase =
          p.equivAmount != null ? p.equivAmount : p.baseFareAmount;
        const mainBaseCurrency =
          p.equivAmount != null
            ? p.equivCurrency || mainCurrency
            : p.baseFareCurrency || mainCurrency;

        const distModel =
          p.distributionModel || p.pricingSource || "";

        return (
          <div key={pi} className="fc-fare-group">
            {/* ── Main fare summary ── */}
            <div className="fc-fare-main">
              <div className="fc-fare-main-head">
                <span className="fc-fare-main-label">Main fare</span>
                {distModel && (
                  <span className="fc-fare-main-source">{distModel}</span>
                )}
              </div>

              <div className="fc-fare-row">
                <span>Currency</span>
                <span>{mainCurrency}</span>
              </div>
              <div className="fc-fare-row">
                <span>Total Base</span>
                <span>
                  {mainBaseCurrency} {fmtPrice(mainBase)}
                </span>
              </div>
              <div className="fc-fare-row">
                <span>Total Taxes</span>
                <span>
                  {mainCurrency} {fmtPrice(p.totalTaxAmount)}
                </span>
              </div>
              {/* <div className="fc-fare-row fc-fare-row-total">
                <span>Total</span>
                <span>
                  {mainCurrency} {fmtPrice(p.totalPrice)}
                </span>
              </div> */}
            </div>

            {/* ── Ticket / carrier line ── */}
            {p.validatingCarrier && (
              <div className="fc-fare-ticket">
                Ticket #{pi + 1} — {p.validatingCarrier}
              </div>
            )}

            <div className="fc-fare-row fc-fare-row-total fc-fare-grand">
              <span>Total ticket price</span>
              <span>
                {mainCurrency} {fmtPrice(p.totalPrice)}
              </span>
            </div>

            {/* ── Per-passenger breakdown ── */}
            {passengers.map((px, xi) => {
              const paxBase =
                px.equivAmount != null
                  ? px.equivAmount
                  : px.baseFareAmount || 0;
              const paxBaseCurrency =
                px.equivAmount != null
                  ? px.equivCurrency || mainCurrency
                  : px.baseFareCurrency || mainCurrency;
              const paxTax = px.totalTaxAmount || 0;
              const paxCount = px.passengerNumber || 1;
              const paxTotal = (paxBase + paxTax) * paxCount;

              const paxLabel =
                px.passengerType === "ADT"
                  ? "Adult Fare Breakdown"
                  : px.passengerType === "CNN"
                  ? "Child Fare Breakdown"
                  : px.passengerType === "INF"
                  ? "Infant Fare Breakdown"
                  : px.passengerType;

              return (
                <div key={xi} className="fc-fare-pax">
                  <div className="fc-fare-pax-head">{paxLabel}</div>

                  <div className="fc-fare-row">
                    <span>Base</span>
                    <span>
                      {paxBaseCurrency} {fmtPrice(paxBase)}
                    </span>
                  </div>
                  <div className="fc-fare-row">
                    <span>Taxes</span>
                    <span>
                      {mainCurrency} {fmtPrice(paxTax)}
                    </span>
                  </div>
                  {paxCount > 1 && (
                    <div className="fc-fare-row fc-fare-pax-multi">
                      <span />{/* empty label col */}
                      <span>×{paxCount}</span>
                    </div>
                  )}
                  <div className="fc-fare-row fc-fare-row-total">
                    <span>Total breakdown amount</span>
                    <span>
                      {mainCurrency} {fmtPrice(paxTotal)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════
   TAB 3 — Baggage & Fare Rules
   ═══════════════════════════════════════ */

function BaggageFareRulesTab({ pricing, segments }) {
console.log("Pricing are :", pricing);
  return (
    <div className="fc-det-section">
      <h4 className="fc-det-title">Baggage and Fare Rules</h4>

      {pricing.map((p, pi) => {
        const passengers = p.passengers || [];
        const mainCurrency = p.currency || "USD";

        return (
          <div key={pi} className="fc-bag-group">
            {passengers.map((px, xi) => {
              const paxLabel =
                px.passengerType === "ADT"
                  ? "Adult"
                  : px.passengerType === "CNN"
                  ? "Child"
                  : px.passengerType === "INF"
                  ? "Infant"
                  : px.passengerType;
              const paxCount = px.passengerNumber || 1;
              const fareComps = px.fareComponents || [];
              const baggage = px.baggage || [];

              return (
                <div key={xi} className="fc-bag-pax">
                  <div className="fc-bag-pax-head">
                    {paxLabel}
                    {/* {paxCount > 1 && ` × ${paxCount}`} */}
                  </div>

                  {/* ── Paired rows: route | class | allowance ── */}
                  {fareComps.map((fc, fci) => {
                    const bag = baggage[fci];
                    const a   = bag?.allowance;
                    const hasPieces  = a && a.pieceCount != null && a.pieceCount > 0;
                    const hasWeight  = a && a.weight != null && a.weight > 0;
                    const hasAllow   = hasPieces || hasWeight;

                    return (
                      <div key={fci} className="fc-bag-row">
                        {/* Col 1 — Route */}
                        <div className="fc-bag-col-route">
                          <span className="fc-bag-route">
                            {fc.beginAirport}-{fc.endAirport}
                          </span>
                        </div>

                        {/* Col 2 — Booking code / Cabin / Fare basis (stacked) */}
                        <div className="fc-bag-col-class">
                          {fc.bookingCode && (
                            <span className="fc-bag-code">BookingCode : {fc.bookingCode}</span>
                          )}
                          {fc.cabinCode && (
                            <span className="fc-bag-cabin">CabinCode : {fc.cabinCode}</span>
                          )}
                          {fc.fareBasis && (
                            <span className="fc-bag-fb">{fc.fareBasis}</span>
                          )}
                        </div>

                        {/* Col 3 — Baggage allowance */}
                        <div className="fc-bag-col-allowance">
                          {hasAllow ? (
                            <>
                              {hasPieces && (
                                <span className="fc-bag-pieces">
                                  {a.pieceCount} pc{a.pieceCount > 1 ? "s" : ""}
                                </span>
                              )}
                              {hasWeight && (
                                <span className="fc-bag-weight">
                                  {a.weight} {a.unit || "kg"}
                                </span>
                              )}
                              {a.description1 && (
                                <span className="fc-bag-desc">{a.description1}</span>
                              )}
                              {a.description2 && (
                                <span className="fc-bag-desc">{a.description2}</span>
                              )}
                            </>
                          ) : (
                            <span className="fc-bag-empty">—</span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* ── Orphan baggage entries (more bags than fare-comps) ── */}
                  {baggage.slice(fareComps.length).map((bag, bi) => {
                    const a = bag.allowance;
                    if (!a) return null;
                    const hasPieces = a.pieceCount != null && a.pieceCount > 0;
                    const hasWeight = a.weight != null && a.weight > 0;
                    if (!hasPieces && !hasWeight) return null;

                    return (
                      <div key={`x${bi}`} className="fc-bag-row">
                        <div className="fc-bag-col-route">
                          <span className="fc-bag-route" />
                        </div>
                        <div className="fc-bag-col-class" />
                        <div className="fc-bag-col-allowance">
                          {hasPieces && (
                            <span className="fc-bag-pieces">
                              {a.pieceCount} pc{a.pieceCount > 1 ? "s" : ""}
                            </span>
                          )}
                          {hasWeight && (
                            <span className="fc-bag-weight">
                              {a.weight} {a.unit || "kg"}
                            </span>
                          )}
                          {a.description1 && (
                            <span className="fc-bag-desc">{a.description1}</span>
                          )}
                          {a.description2 && (
                            <span className="fc-bag-desc">{a.description2}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* ── Ticket / refund notes ── */}
                  <div className="fc-bag-notes">
                    {px.lastTicketDate && (
                      <span className="fc-det-ticket">
                        Ticket by {px.lastTicketDate}
                        {px.lastTicketTime ? ` ${px.lastTicketTime}` : ""}
                      </span>
                    )}
                    {px.nonRefundable ? (
                      <span className="fc-det-nonref">Non-refundable</span>
                    ) : (
                      <span className="fc-det-ref">Refundable</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════ */

function getDT(seg, type) {
  if (type === "dep")
    return seg.departureDateTime || seg.departureTime || "";
  return seg.arrivalDateTime || seg.arrivalTime || "";
}

function parseDT(s) {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d) ? null : d;
}

function fmtTime(s) {
  const d = parseDT(s);
  if (d)
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  const m = s && s.match(/(\d{1,2}):(\d{2})/);
  if (m) {
    let h = parseInt(m[1], 10);
    const min = m[2];
    const ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${min} ${ap}`;
  }
  return s || "";
}

function fmtDate(s) {
  const d = parseDT(s);
  if (d)
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  return "";
}

function fmtPrice(n) {
  return (Number(n) || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/* ═══════════════════════════════════════
   LEG GROUPING
   ═══════════════════════════════════════ */

function groupLegs(segments, directionInd) {
  if (!segments || !segments.length) return [];

  if (directionInd !== "Return" || segments.length === 1) {
    return [{ type: "outbound", segments }];
  }

  let maxGap = 0;
  let split = Math.ceil(segments.length / 2);

  for (let i = 0; i < segments.length - 1; i++) {
    const a = parseDT(getDT(segments[i], "arr"));
    const b = parseDT(getDT(segments[i + 1], "dep"));
    if (a && b) {
      const gap = b - a;
      if (gap > maxGap) {
        maxGap = gap;
        split = i + 1;
      }
    }
  }

  return [
    { type: "outbound", segments: segments.slice(0, split) },
    { type: "return", segments: segments.slice(split) },
  ];
}

export default FlightCard;