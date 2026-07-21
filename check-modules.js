import { getPool } from './server/config/db.js';
async function run() {
  const pool = await getPool();
  const res = await pool.request().query(`
    SELECT * FROM APP_MODULES
  `);
  console.dir(res.recordset);
  process.exit(0);
}
run();
