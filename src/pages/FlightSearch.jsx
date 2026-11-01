import SearchForm from "../components/SearchForm";

function FlightSearch() {
  return (
    <div style={styles.page}>
      <SearchForm />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 60px)",
    background: "#f5f5f5",
    // padding: "1rem",
  },
};

export default FlightSearch;