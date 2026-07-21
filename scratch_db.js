import { getPool } from './server/config/db.js';
async function test() {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT TABLE_NAME, COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE COLUMN_NAME LIKE '%Employee_Vehicle_Entry%' OR COLUMN_NAME = 'VALID_FROM'");
    console.log(result.recordset);
    process.exit(0);
  } catch(e) { console.error(e); process.exit(1); }
}
test();
