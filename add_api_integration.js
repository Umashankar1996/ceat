import sql from "mssql";
import { config } from "dotenv";

config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function runMigration() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log("Connected to DB.");

    await pool.request().query(`
      IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'API_Integration')
      BEGIN
        CREATE TABLE API_Integration (
          ID INT IDENTITY(1,1) PRIMARY KEY,
          LOCATION INT NULL,
          SUBREG INT NULL,
          INTEGRATION VARCHAR(200) NULL,
          TYPE VARCHAR(100) NULL,
          HEADERS VARCHAR(MAX) NULL,
          ISACTIVE BIT NOT NULL DEFAULT 1,
          API_KEY VARCHAR(500) NULL,
          POST_URL VARCHAR(500) NULL,
          MODULE VARCHAR(100) NULL,
          HTTPVERB VARCHAR(50) NULL,
          MODELREPLACE VARCHAR(500) NULL,
          CERTIFICATE VARCHAR(500) NULL,
          DIVISION_URL VARCHAR(500) NULL,
          CARD_TYPE_URL VARCHAR(500) NULL,
          CERT_PASSWORD VARCHAR(500) NULL,
          EVENTID INT NULL,
          VEHICLE_TYPE_URL VARCHAR(500) NULL,
          CARD_TYPE_URL_1 VARCHAR(500) NULL,
          ACCESSGROUP_TYPE_Url VARCHAR(500) NULL,
          BODY_JSON_DATA VARCHAR(MAX) NULL,
          ACCESS_KEY VARCHAR(500) NULL,
          SECRET_KEY VARCHAR(500) NULL,
          APPID VARCHAR(100) NULL,
          METHOD VARCHAR(50) NULL,
          grant_type VARCHAR(100) NULL,
          client_id VARCHAR(100) NULL,
          DIVISION_URL_1 VARCHAR(500) NULL
        );
        PRINT 'API_Integration table created.';
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT 1 FROM API_Integration WHERE INTEGRATION = 'DUMMY_SAP')
      BEGIN
        INSERT INTO API_Integration (INTEGRATION, TYPE, ISACTIVE, POST_URL, HTTPVERB, BODY_JSON_DATA)
        VALUES ('DUMMY_SAP', 'SAP', 1, 'https://dummyjson.com/http/200', 'POST', '{"status":"OK"}');
      END
    `);

    console.log("Migration completed.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

runMigration();
