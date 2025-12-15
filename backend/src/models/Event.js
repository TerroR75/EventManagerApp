import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

const Event = sequelize.define("Event", {
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  poster_url: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
  },
  seats: {
    type: DataTypes.INTEGER,
  },
  latitude: {
    type: DataTypes.DOUBLE,
  },
  longitude: {
    type: DataTypes.DOUBLE,
  },
  event_date: { type: DataTypes.DATE },
  embedding: {
    type: DataTypes.JSONB, // placeholder na embedding w przyszłości
  },
});

export default Event;
