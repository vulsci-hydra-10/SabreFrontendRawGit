import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BookingForm from "./components/BookingForm";
import FlightSearch from "./pages/FlightSearch";
import FlightResults from "./pages/FlightResults";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<FlightSearch />} />
          <Route path="/results" element={<FlightResults />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/booking" element={<BookingForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;