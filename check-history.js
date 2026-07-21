import { getPool } from './server/config/db.js';
async function run() {
  const pool = await getPool();
  const res = await pool.request().query(`
    SELECT MODULE_ID, ACTION_BY, NOTES FROM TRUCK_HISTORY_LOG WHERE TRUCK_ID = 'F8B27A71-C901-4F3F-8E57-C2A68B5550F9' ORDER BY TIMESTAMP ASC
  `);
  console.dir(res.recordset);
  process.exit(0);
}
run();
