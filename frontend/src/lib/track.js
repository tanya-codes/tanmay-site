import axios from "axios";

const BACKEND_BASE = (process.env.REACT_APP_BACKEND_URL || "http://localhost:8000").replace(/\/+$/, "");
const API = `${BACKEND_BASE}/api`;

export async function trackEvent(event, meta) {
  try {
    await axios.post(`${API}/analytics/event`, { event, meta: meta || {} });
  } catch (e) {
    // silent — analytics should never break UX
  }
}

export { API };
