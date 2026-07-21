import { getPool } from "./server/config/db.js";

async function checkApiConfig() {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .query("SELECT API_NAME, API_URL, HTTP_METHOD, REQUEST_TEMPLATE_JSON, USERNAME, PASSWORD_HASH FROM API_CONFIGURATION WHERE API_NAME = 'SAP_GATE_ENTRY'");
    
    console.log(JSON.stringify(result.recordset[0], null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkApiConfig();
