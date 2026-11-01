const API_URL = import.meta.env.VITE_API_URL;

/**
 * Get Sabre auth token
 */
export async function getAuthToken() {
  const response = await fetch(`${API_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to get auth token");
  }

  return response.json();
}

/**
 * Search flights
 * @param {object} searchParams
 */
export async function searchFlights(searchParams) {
  const response = await fetch(`${API_URL}/flights/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(searchParams),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to search flights");
  }

  return response.json();
}

/**
 * Test hello endpoint
 */
export async function testConnection() {
  const response = await fetch(`${API_URL}/hello`);

  if (!response.ok) {
    throw new Error("Failed to connect to server");
  }

  return response.json();
}