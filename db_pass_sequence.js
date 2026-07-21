import sql from "mssql";
import { config } from "dotenv";

config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function runMigration() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log("Connected to DB.");

    // Create PASS_SEQUENCE_CONFIG table
    console.log("Creating PASS_SEQUENCE_CONFIG table...");
    await pool.request().query(`
      IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'PASS_SEQUENCE_CONFIG')
      BEGIN
        CREATE TABLE PASS_SEQUENCE_CONFIG (
          ID INT IDENTITY(1,1) PRIMARY KEY,
          SCOPE VARCHAR(50) NOT NULL DEFAULT 'GLOBAL', -- 'GLOBAL' or 'VEHICLE_TYPE'
          VEHICLE_TYPE_ID INT NULL,
          PREFIX VARCHAR(50) NOT NULL DEFAULT 'PASS-',
          CURRENT_NUMBER INT NOT NULL DEFAULT 0,
          PADDING_LENGTH INT NOT NULL DEFAULT 4,
          ISACTIVE BIT NOT NULL DEFAULT 1,
          CREATED_AT DATETIME DEFAULT GETDATE(),
          UPDATED_AT DATETIME DEFAULT GETDATE()
        );
      END
    `);

    // Ensure at least a GLOBAL record exists
    console.log("Ensuring global sequence exists...");
    await pool.request().query(`
      IF NOT EXISTS (SELECT 1 FROM PASS_SEQUENCE_CONFIG WHERE SCOPE = 'GLOBAL' AND ISACTIVE = 1)
      BEGIN
        INSERT INTO PASS_SEQUENCE_CONFIG (SCOPE, PREFIX, CURRENT_NUMBER, PADDING_LENGTH)
        VALUES ('GLOBAL', 'PASS-', 0, 4);
      END
    `);

    // Alter GATE_PASS_PRINT_LOG to add PASS_NUMBER
    console.log("Altering GATE_PASS_PRINT_LOG to add PASS_NUMBER...");
    await pool.request().query(`
      IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'GATE_PASS_PRINT_LOG' AND COLUMN_NAME = 'PASS_NUMBER'
      )
      BEGIN
        ALTER TABLE GATE_PASS_PRINT_LOG ADD PASS_NUMBER VARCHAR(100) NULL;
      END
    `);

    console.log("Migration completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

runMigration();
