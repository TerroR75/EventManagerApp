import Event from "../models/Event.js";

export async function createEvent(req, res) {
  const { title, description, poster_url, price, seats, latitude, longitude } = req.body;

  if (!title || !description) return res.status(400).json({ error: "Missing fields" });

  const event = await Event.create({ title, description, poster_url, price, seats, latitude, longitude });
  res.status(201).json(event);
}

export async function listEvents(req, res) {
  try {
    const events = await Event.findAll({ order: [["event_date", "ASC"]] });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
