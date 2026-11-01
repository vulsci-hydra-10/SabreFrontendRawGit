
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <main className="home-page">
      <Hero />

      <section className="trust-section">
        <div className="trust-heading">
          <span className="trust-kicker">TRAVEL WITH CONFIDENCE</span>
          <h2>Technology that takes you further.</h2>
        </div>

        <div className="trust-grid">
          <article className="trust-item">
            <div className="trust-icon">✓</div>
            <div>
              <h3>Reliable Search</h3>
              <p>Flight options from the Sabre GDS API.</p>
            </div>
          </article>

          <article className="trust-item">
            <div className="trust-icon">✈</div>
            <div>
              <h3>Travel Made Simple</h3>
              <p>A straightforward flight-search experience.</p>
            </div>
          </article>

          <article className="trust-item">
            <div className="trust-icon">↗</div>
            <div>
              <h3>Explore More</h3>
              <p>Start planning your next trip in just a few steps.</p>
            </div>
          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default Home;