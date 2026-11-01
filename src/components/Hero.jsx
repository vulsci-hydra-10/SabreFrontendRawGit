import { useNavigate, useLocation, Link  } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeroCloudyAnim from "../components/HeroCloudyAnim";
import Dashboard from "../pages/Dashboard";

const features = [
  {
    icon: "⌕",
    title: "Smart Search",
    description:
      "Find one-way and round-trip flights with flexible passenger options.",
    color: "blue",
  },
  {
    icon: "↘",
    title: "Competitive Fares",
    description:
      "Discover available fares through Sabre's Bargain Finder Max service.",
    color: "pink",
  },
  {
    icon: "◎",
    title: "Global Connections",
    description:
      "Explore flight options across destinations around the world.",
    color: "purple",
  },
];


// HOME HERO
function HomeHero() {
  const navigate = useNavigate();

  return (
    <section className="home-hero">
      <Navbar />

      <div className="hero-content">
        <div className="hero-copy">
          <h1>
            Your next <br /> journey starts <br />
            <span>right here.</span>
          </h1>

          <p className="hero-description">
            Discover your next destination with a smarter way to search for flights. Explore available fares and find the journey that works for you.
          </p>

          <div className="hero-actions">
            <button
              className="primary-cta"
              onClick={() => navigate("/search")}
            >
              <span>Find your flight</span>
              <span className="cta-arrow" aria-hidden="true">
                →
              </span>
            </button>

            <span className="cta-note">
              Simple search. More possibilities.
            </span>
          </div>

          <div className="hero-proof">
            <span className="proof-icon">✓</span>
            Powered by onlinetools.sabre.com
          </div>
        </div>

        <div className="hero-side-note">
          <span className="side-note-line" />
          <span>THE WORLD IS YOURS TO EXPLORE</span>
        </div>
      </div>

      <div className="hero-bottom">
        {features.map((feature, index) => (
          <article className="feature-card" key={feature.title}>
            <div
              className={`feature-icon ${feature.color}`}
              aria-hidden="true"
            >
              {feature.icon}
            </div>

            <div>
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </div>

            {index < features.length - 1 && (
              <span className="feature-divider" />
            )}
          </article>
        ))}
      </div>
    </section>
  );
}



// SEARCH HERO
function SearchHero() {
    return (
      <section className="search-banner">
        <Navbar />

        <div className="search-banner-inner">
          <div className="search-eyebrow">
            <span className="search-eyebrow-dot" />
            YOUR NEXT JOURNEY STARTS HERE
          </div>

          <h1>
            Let's find your
            <br />
            <span>perfect flight.</span>
          </h1>

          <p>
            Explore available flights, compare fares, and find the right
            journey for your next adventure.
          </p>

          <div className="search-banner-note">
            <span aria-hidden="true">✈</span>
            Powered by Sabre flight search technology
          </div>
        </div>
      </section>
    );
}



// RESULT HERO
function ResultHero({ searchParams }) {
  const navigate = useNavigate();

  const origin = searchParams?.origin || "Origin";
  const destination = searchParams?.destination || "Destination";
  const isRoundTrip = searchParams?.tripType === "roundtrip";

    
    return (

    //   <section className="results-hero">
    //     <Navbar />
    //     <div className="results-hero-inner">

    //       <div className="results-heading-row">
    //         <div>
    //           <span className="results-eyebrow">
    //             YOUR NEXT JOURNEY STARTS HERE
    //           </span>
    //           <h1>Find your perfect flight<span>.</span></h1>
    //           <p className="results-heading-description">
    //             Compare available flights and choose the journey
    //             that works best for you.
    //           </p>
    //         </div>

    //         <div className="action-nd-step">
    //           <button
    //             className="results-edit-search"
    //             onClick={() => navigate("/search")}
    //           >
    //             <span>✎</span> Edit Search
    //           </button>

    //           <div className="results-breadcrumb">
    //             <Link to="/">Home</Link>
    //             <span>/</span>
    //             <span>Flight Results</span>
    //           </div>
    //         </div>
    //       </div>

    //       <div className="route-summary-card">
    //         <div className="route-summary-main">
    //           <div className="route-airport">
    //             <span className="route-label">FROM</span>
    //             <strong>{origin}</strong>
    //             <span className="route-caption">Departure airport</span>
    //           </div>

    //           <div className="route-visual">
    //             <span className="route-line" />
    //             <span className="route-plane">✈</span>
    //             <span className="route-type">
    //               {isRoundTrip ? "ROUND TRIP" : "ONE WAY"}
    //             </span>
    //           </div>

    //           <div className="route-airport route-destination">
    //             <span className="route-label">TO</span>
    //             <strong>{destination}</strong>
    //             <span className="route-caption">Arrival airport</span>
    //           </div>
    //         </div>

    //         <div className="route-summary-divider" />

    //         <div className="route-details">
    //           <div className="route-detail-item">
    //             <span className="route-detail-icon">▦</span>
    //             <div>
    //               <span className="route-detail-label">DEPARTURE</span>
    //               <strong>{searchParams?.departureDate || "Not specified"}</strong>
    //             </div>
    //           </div>

    //           {isRoundTrip && (
    //             <div className="route-detail-item">
    //               <span className="route-detail-icon">↩</span>
    //               <div>
    //                 <span className="route-detail-label">RETURN</span>
    //                 <strong>{searchParams?.returnDate || "Not specified"}</strong>
    //               </div>
    //             </div>
    //           )}

    //           <div className="route-detail-item">
    //             <span className="route-detail-icon">♙</span>
    //             <div>
    //               <span className="route-detail-label">TRAVELLERS</span>
    //               <strong>
    //                 {(Number(searchParams?.adults) || 0)} Adult
    //                 {(Number(searchParams?.adults) || 0) !== 1 ? "s" : ""}
    //                 {Number(searchParams?.children) > 0
    //                   ? `, ${searchParams.children} Child${Number(searchParams.children) !== 1 ? "ren" : ""}`
    //                   : ""}
    //                 {Number(searchParams?.infants) > 0
    //                   ? `, ${searchParams.infants} Infant${Number(searchParams.infants) !== 1 ? "s" : ""}`
    //                   : ""}
    //               </strong>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </section>
      <>
    <HeroCloudyAnim searchParams={searchParams} />
    </>
    );
}





function Hero({searchParams}) {
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";

  switch (location.pathname) {
    case "/":
        return <HomeHero />;
    case "/search":
        return <SearchHero />;
    case "/results":
        return <ResultHero searchParams={searchParams}  />;
    case "/booking":
        return <ResultHero searchParams={searchParams}  />;
    default:
        return null;
  }

  // Display the Home Hero on /
}

export default Hero;