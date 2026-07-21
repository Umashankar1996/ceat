import { getPool } from './server/config/db.js';
async function run() {
  const pool = await getPool();
  await pool.request().query(`
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'STORE_ACKNOWLEDGEMENT' AND COLUMN_NAME = 'DOCUMENTS_JSON')
      ALTER TABLE STORE_ACKNOWLEDGEMENT ADD DOCUMENTS_JSON NVARCHAR(MAX) NULL;
  `);
  console.log("Done");
  process.exit(0);
}
run();
