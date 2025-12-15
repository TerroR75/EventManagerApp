import express from "express";
import cors from "cors";
import eventsRoutes from "./routes/events.routes.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api/events", eventsRoutes);

export default app;
