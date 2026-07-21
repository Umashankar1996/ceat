import { getPool } from "./server/config/db.js";

async function run() {
  try {
    const pool = await getPool();
    console.log("--- Querying USERROLE ---");
    const roles = await pool.request().query("SELECT * FROM USERROLE");
    console.table(roles.recordset);

    console.log("--- Querying ROLE_UI_CONFIG ---");
    const uiConfig = await pool.request().query("SELECT * FROM ROLE_UI_CONFIG");
    console.table(uiConfig.recordset);
    
    process.exit(0);
  } catch (err) {
    console.error("Error executing query:", err);
    process.exit(1);
  }
}

run();
