import { getPool } from "./server/config/db.js";

async function run() {
  try {
    const pool = await getPool();
    const res = await pool.request().query("SELECT TOP 1 * FROM api_integration");
    console.log(JSON.stringify(res.recordset[0], null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
