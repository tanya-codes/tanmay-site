import axios from "axios";

// API is co-located on the same Vercel project as a serverless function
const API = "/api";

export async function trackEvent(event, meta) {
  try {
    await axios.post(`${API}/analytics/event`, { event, meta: meta || {} });
  } catch (e) {
    // silent — analytics should never break UX
  }
}

export { API };
