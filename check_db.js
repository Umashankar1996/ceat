import { getPool } from "./server/config/db.js";

async function checkDB() {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT ID, TYPE, ISACTIVE, POST_URL, DIVISION_URL, CARD_TYPE_URL, CARD_TYPE_URL_1 FROM API_Integration WHERE TYPE LIKE '%EmployeeVehicle%'");
    console.table(result.recordset);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

checkDB();
