import { getPool } from './server/config/db.js';
async function run() {
  const pool = await getPool();
  const res = await pool.request().query(`
    SELECT * FROM WORKFLOW_SEQUENCE_CONFIG WHERE VEHICLE_TYPE_ID = (
      SELECT VEHICLE_TYPE_ID FROM TRUCK_MASTER WHERE ID = 'F8B27A71-C901-4F3F-8E57-C2A68B5550F9'
    ) ORDER BY SEQUENCE_ORDER ASC
  `);
  console.dir(res.recordset);
  process.exit(0);
}
run();
