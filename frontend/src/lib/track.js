import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export async function trackEvent(event, meta) {
  try {
    await axios.post(`${API}/analytics/event`, { event, meta: meta || {} });
  } catch (e) {
    // silent — analytics should never break UX
  }
}

export { API };
