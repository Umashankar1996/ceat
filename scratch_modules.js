import { getPool } from "./server/config/db.js";

async function run() {
  const pool = await getPool();
  try {
    const res = await pool.request().query("SELECT MODULE_CODE, MODULE_NAME, ROUTE_URL FROM APP_MODULES");
    console.log("APP_MODULES:", res.recordset);
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
