import sequelize from "./sequelize.js";
import Event from "../models/Event.js";

const events = [
  {
    title: "Koncert Warszawa",
    event_date: "2025-06-18",
    latitude: 52.2297,
    longitude: 21.0122,
    poster_url: "https://picsum.photos/600/800?1",
    description: "Największy koncert roku!",
  },
  {
    title: "Stand-up Kraków",
    event_date: "2025-03-22",
    latitude: 50.0647,
    longitude: 19.945,
    poster_url: "https://picsum.photos/600/800?2",
    description: "Wieczór pełen śmiechu",
  },
  {
    title: "Hip-Hop Festival Gdańsk",
    event_date: "2025-04-10",
    latitude: 54.352,
    longitude: 18.6466,
    poster_url: "https://picsum.photos/600/800?3",
    description: "Najlepsi raperzy!",
  },
  {
    title: "Metal Poznań",
    event_date: "2025-05-13",
    latitude: 52.4064,
    longitude: 16.9252,
    poster_url: "https://picsum.photos/600/800?4",
    description: "Mocne brzmienia",
  },
  {
    title: "Spektakl Łódź",
    event_date: "2025-04-30",
    latitude: 51.759,
    longitude: 19.457,
    poster_url: "https://picsum.photos/600/800?5",
    description: "Teatr na najwyższym poziomie",
  },
  {
    title: "Jazz Wrocław",
    event_date: "2025-07-02",
    latitude: 51.1079,
    longitude: 17.0385,
    poster_url: "https://picsum.photos/600/800?6",
    description: "Wieczór z jazzem",
  },
];

async function seed() {
  try {
    await sequelize.sync({ force: true }); // usuwa starą tabelę i tworzy nową
    console.log("✅ Tables synced");

    for (const event of events) {
      await Event.create(event);
    }

    console.log("✅ Events seeded");
    process.exit();
  } catch (err) {
    console.error("Seed error:", err);
  }
}

seed();
