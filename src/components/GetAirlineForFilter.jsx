import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const GetAirlineNames = ({
  airlineCodes = [],
  onSelectionChange,
}) => {
  const [airlines, setAirlines] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAirlines = async () => {
      if (!airlineCodes.length) {
        setAirlines([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/airlines/filterCareer`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              airlineCodes,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch airlines");
        }

        const data = await response.json();

        setAirlines(data.airlines || []);

      } catch (error) {
        console.error("Airline Fetch Error:", error);
        setError("Unable to load airlines");
      } finally {
        setLoading(false);
      }
    };

    fetchAirlines();
  }, [airlineCodes]);

  const handleAirlineChange = (code) => {
    setSelectedAirlines((previous) => {
      const updated = previous.includes(code)
        ? previous.filter((item) => item !== code)
        : [...previous, code];

      onSelectionChange?.(updated);

      return updated;
    });
  };

  if (loading) {
    return <p>Loading airlines...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="airline-filter">

      <h3>Airlines</h3>

      {airlines.map((airline) => (
        <label
          key={airline.airline_code}
          className="airline-filter-item"
        >
          <input
            type="checkbox"
            checked={selectedAirlines.includes(
              airline.airline_code
            )}
            onChange={() =>
              handleAirlineChange(airline.airline_code)
            }
          />

          {airline.logo_url && (
            <img
              src={airline.logo_url}
              alt={airline.airline_name}
              width="30"
              height="30"
            />
          )}

          <span>{airline.airline_name}</span>

        </label>
      ))}

    </div>
  );
};

export default GetAirlineNames;
