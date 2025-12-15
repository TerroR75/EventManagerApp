import axios from "axios";

const API_BASE = "http://localhost:3000/api";

export async function fetchEvents() {
  try {
    const res = await axios.get(`${API_BASE}/events`);
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.error("API fetchEvents error:", err);
    return [];
  }
}

export async function createEvent(event) {
  try {
    const res = await axios.post(`${API_BASE}/events`, event);

    return res.data;
  } catch (err) {
    console.error("API createEvent error:", err);
    return null;
  }
}
