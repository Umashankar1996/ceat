import { getPool } from './server/config/db.js';
async function run() {
  const pool = await getPool();
  await pool.request().query(`
    DELETE FROM WORKFLOW_SEQUENCE_CONFIG WHERE MODULE_ID >= 10;
    
    UPDATE TRUCK_HISTORY_LOG SET MODULE_ID = 1 WHERE NOTES LIKE '%security inspection completed%' AND MODULE_ID = 2;
    UPDATE TRUCK_HISTORY_LOG SET MODULE_ID = 2 WHERE NOTES LIKE 'SAP entry completed' AND MODULE_ID = 3;
    UPDATE TRUCK_HISTORY_LOG SET MODULE_ID = 3 WHERE NOTES LIKE 'Store approved%' AND MODULE_ID = 4;
    UPDATE TRUCK_HISTORY_LOG SET MODULE_ID = 4 WHERE NOTES LIKE 'okay allow' AND MODULE_ID = 5;
    UPDATE TRUCK_HISTORY_LOG SET MODULE_ID = 5 WHERE NOTES LIKE 'Loading operations%' AND (MODULE_ID = 10 OR MODULE_ID = 6);
    UPDATE TRUCK_HISTORY_LOG SET MODULE_ID = 6 WHERE NOTES = 'ok' AND MODULE_ID = 7;
    UPDATE TRUCK_HISTORY_LOG SET MODULE_ID = 7 WHERE NOTES LIKE 'Store acknowledged%' AND MODULE_ID = 8;
    UPDATE TRUCK_HISTORY_LOG SET MODULE_ID = 8 WHERE NOTES LIKE 'Security acknowledged%' AND MODULE_ID = 9;
  `);
  console.log("Fixed DB");
  process.exit(0);
}
run();
