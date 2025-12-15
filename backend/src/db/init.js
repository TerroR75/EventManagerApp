import sequelize from "./sequelize.js";
import Event from "../models/Event.js";

export async function initDb() {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected");

    await sequelize.sync();
    console.log("✅ Tables synced");
  } catch (err) {
    console.error("DB error:", err);
  }
}
