import { getPool } from "./server/config/db.js";

async function run() {
  const pool = await getPool();
  try {
    const res = await pool.request().query("SELECT TOP 1 * FROM USERLOGINS");
    console.log("USERLOGINS Columns:", Object.keys(res.recordset[0] || {}));
    
    const sys = await pool.request().query("SELECT TOP 5 * FROM SYSTEMLIST WHERE CODE='UserType'");
    console.log("SYSTEMLIST UserType rows:", sys.recordset);
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
