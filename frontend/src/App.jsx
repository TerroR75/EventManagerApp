// Plik: App.jsx (React) - wersja PRO z Framer Motion

import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import "./app.css";
import { fetchEvents } from "./api/agent";

// Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function FlyToEvent({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 12, { duration: 1.0 });
  }, [coords, map]);
  return null;
}

export default function App() {
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const posterRowRef = useRef(null);
  const [events, setEvents] = useState([]);

  const filtered = events.filter((ev) => ev.title.toLowerCase().includes(search.toLowerCase()));

  // Autoscroll slider (simple, with pause on hover)
  useEffect(() => {
    const root = posterRowRef.current;
    if (!root) return;
    let rafId = null;
    let speed = 0.4; // px per frame
    let running = true;

    function step() {
      if (!running) return;
      root.scrollLeft += speed;
      // loop
      if (root.scrollLeft >= root.scrollWidth - root.clientWidth) {
        root.scrollLeft = 0;
      }
      rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);

    const onEnter = () => (running = false);
    const onLeave = () => {
      running = true;
      rafId = requestAnimationFrame(step);
    };
    root.addEventListener("mouseenter", onEnter);
    root.addEventListener("mouseleave", onLeave);

    fetchEvents().then((data) => setEvents(data));

    return () => {
      root.removeEventListener("mouseenter", onEnter);
      root.removeEventListener("mouseleave", onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const posterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.08 } }),
  };

  return (
    <div className="page-container">
      <header className="topbar">
        <h1 className="title">yourEvent</h1>
        <div className="search-box">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Szukaj wydarzeń..." />
        </div>
      </header>

      {/* EBILET STYLE SLIDER */}
      <section className="poster-row" ref={posterRowRef} aria-label="Polecane wydarzenia">
        {filtered.map((ev) => (
          <motion.div
            key={ev.id}
            className="poster-card"
            onClick={() => setSelectedEvent(ev)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={posterVariants}
          >
            <span className="poster-badge">{ev.title}</span>
            <img src={ev.poster_url} alt={ev.title} />
            <div className="poster-info">
              <h3>{ev.title}</h3>
            </div>
          </motion.div>
        ))}
      </section>

      {/* MAP */}
      <div className="map-section">
        <MapContainer center={[52, 19]} zoom={6} className="map-box">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {selectedEvent && <FlyToEvent coords={[selectedEvent.latitude, selectedEvent.longitude]} />}

          {events.map((ev) => (
            <Marker key={ev.id} position={[ev.latitude, ev.longitude]}>
              <Popup>
                <strong>{ev.title}</strong>
                <br />
                {ev.event_date}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* LIST (LEWY ALIGN) */}
      <section className="list-section">
        <h2>Wszystkie wydarzenia</h2>
        <div className="list-grid">
          {filtered.map((ev, i) => (
            <motion.div
              key={ev.id}
              className="list-item"
              onClick={() => setSelectedEvent(ev)}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={listItemVariants}
            >
              <span className="countdown">{ev.event_date}</span>
              <img src={ev.poster_url} className="list-poster" alt={ev.title} />
              <div className="list-text">
                <h3>{ev.title}</h3>
                <p className="desc">{ev.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
