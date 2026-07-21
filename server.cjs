/**
 * Truck-CEAT API Server
 * Persists truck data to src/data/trucks.json so all clients share the same state.
 * Run alongside Vite dev server using: npm run dev:full
 */


const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, "src", "data", "trucks.json");


app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Ensure trucks.json exists
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, "[]", "utf8");
}

/** GET /api/trucks — return all trucks */
app.get("/api/trucks", (_req, res) => {
  try {
    const data = fs.readFileSync(DB_PATH, "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: "Failed to read trucks.json" });
  }
});

/** POST /api/trucks — replace entire trucks array (full sync) */
app.post("/api/trucks", (req, res) => {
  try {
    const trucks = req.body;
    if (!Array.isArray(trucks)) {
      return res.status(400).json({ error: "Body must be an array" });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(trucks, null, 2), "utf8");
    res.json({ ok: true, count: trucks.length });
  } catch (err) {
    res.status(500).json({ error: "Failed to write trucks.json" });
  }
});

/** DELETE /api/trucks — clear all trucks (reset demo) */
app.delete("/api/trucks", (_req, res) => {
  try {
    fs.writeFileSync(DB_PATH, "[]", "utf8");
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear trucks.json" });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ Truck-CEAT API server running at http://localhost:${PORT}`);
  console.log(`   Persisting data to: ${DB_PATH}\n`);
});
