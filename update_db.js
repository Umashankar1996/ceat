import sql from "mssql";
import "dotenv/config";

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  server: process.env.DB_SERVER,
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === "true",
  },
};

async function updateDB() {
  try {
    await sql.connect(sqlConfig);
    console.log("Connected to DB.");

    // Update IPs from .17 to .51
    await sql.query(`
      UPDATE api_integration
      SET 
        POST_URL = REPLACE(POST_URL, '10.65.56.17', '10.65.56.51'),
        DIVISION_URL = REPLACE(DIVISION_URL, '10.65.56.17', '10.65.56.51'),
        CARD_TYPE_URL = REPLACE(CARD_TYPE_URL, '10.65.56.17', '10.65.56.51'),
        ACCESSGROUP_TYPE_Url = REPLACE(ACCESSGROUP_TYPE_Url, '10.65.56.17', '10.65.56.51')
      WHERE INTEGRATION = 'ANPR';
    `);

    // Update IPs from .18 to .52
    await sql.query(`
      UPDATE api_integration
      SET 
        POST_URL = REPLACE(POST_URL, '10.65.56.18', '10.65.56.52'),
        DIVISION_URL = REPLACE(DIVISION_URL, '10.65.56.18', '10.65.56.52'),
        CARD_TYPE_URL = REPLACE(CARD_TYPE_URL, '10.65.56.18', '10.65.56.52'),
        ACCESSGROUP_TYPE_Url = REPLACE(ACCESSGROUP_TYPE_Url, '10.65.56.18', '10.65.56.52')
      WHERE INTEGRATION = 'ANPR';
    `);

    // Update TYPE column string replacements
    await sql.query(`
      UPDATE api_integration
      SET TYPE = REPLACE(TYPE, 'EmployeeVehicle', 'Vehicle')
      WHERE INTEGRATION = 'ANPR' AND TYPE LIKE 'EmployeeVehicle%';
    `);

    console.log("Database updated successfully.");
    process.exit(0);
  } catch (err) {
    console.error("DB Error:", err);
    process.exit(1);
  }
}

updateDB();
