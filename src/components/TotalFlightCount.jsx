function TotalFlightCount({ totalFlights }) {
  return (
    <div className="results-count">
      <strong>{totalFlights}</strong>
      <span>
        {totalFlights === 1 ? "flight found" : "flights found"}
      </span>
    </div>
  );
}

export default TotalFlightCount;