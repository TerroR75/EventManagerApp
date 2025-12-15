import app from "./app.js";
import { initDb } from "./db/init.js";

const PORT = process.env.PORT || 3000;

initDb();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
