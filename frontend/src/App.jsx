// Plik: App.jsx (React) - wersja PRO z Framer Motion

import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";
import "./app.css";

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

  const events = [
    { id: 1, name: "Koncert Warszawa", date: "2025-06-18", lat: 52.2297, lng: 21.0122, poster: "https://picsum.photos/600/800?1", desc: "Największy koncert roku!" },
    { id: 2, name: "Stand-up Kraków", date: "2025-03-22", lat: 50.0647, lng: 19.945, poster: "https://picsum.photos/600/800?2", desc: "Wieczór pełen śmiechu" },
    { id: 3, name: "Hip-Hop Festival Gdańsk", date: "2025-04-10", lat: 54.352, lng: 18.6466, poster: "https://picsum.photos/600/800?3", desc: "Najlepsi raperzy!" },
    { id: 4, name: "Metal Poznań", date: "2025-05-13", lat: 52.4064, lng: 16.9252, poster: "https://picsum.photos/600/800?4", desc: "Mocne brzmienia" },
    { id: 5, name: "Spektakl Łódź", date: "2025-04-30", lat: 51.759, lng: 19.457, poster: "https://picsum.photos/600/800?5", desc: "Teatr na najwyższym poziomie" },
    { id: 6, name: "Jazz Wrocław", date: "2025-07-02", lat: 51.1079, lng: 17.0385, poster: "https://picsum.photos/600/800?6", desc: "Wieczór z jazzem" }
  ];

  const filtered = events.filter(ev => ev.name.toLowerCase().includes(search.toLowerCase()));

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
    const onLeave = () => { running = true; rafId = requestAnimationFrame(step); };
    root.addEventListener("mouseenter", onEnter);
    root.addEventListener("mouseleave", onLeave);

    return () => {
      root.removeEventListener("mouseenter", onEnter);
      root.removeEventListener("mouseleave", onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const posterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.08 } })
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
            <span className="poster-badge">{ev.date}</span>
            <img src={ev.poster} alt={ev.name} />
            <div className="poster-info">
              <h3>{ev.name}</h3>
            </div>
          </motion.div>
        ))}
      </section>

      {/* MAP */}
      <div className="map-section">
        <MapContainer center={[52, 19]} zoom={6} className="map-box">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {selectedEvent && <FlyToEvent coords={[selectedEvent.lat, selectedEvent.lng]} />}

          {events.map(ev => (
            <Marker key={ev.id} position={[ev.lat, ev.lng]}>
              <Popup>
                <strong>{ev.name}</strong><br />{ev.date}
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
              <span className="countdown">{ev.date}</span>
              <img src={ev.poster} className="list-poster" alt={ev.name} />
              <div className="list-text">
                <h3>{ev.name}</h3>
                <p className="desc">{ev.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}


