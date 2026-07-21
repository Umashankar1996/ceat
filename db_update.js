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

async function runUpdate() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log("Connected to DB.");

    // 1. Create mapping table
    await pool.request().query(`
      IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ROLE_UI_CONFIG')
      BEGIN
        CREATE TABLE ROLE_UI_CONFIG (
          ROLE_ID INT NOT NULL PRIMARY KEY,
          LANDING_PAGE VARCHAR(200) NULL,
          ALL_TRUCKS_VIEW VARCHAR(50) DEFAULT 'ALL' NULL,
          CONSTRAINT FK_RUC_ROLE FOREIGN KEY (ROLE_ID) REFERENCES USERROLE(ID) ON DELETE CASCADE
        );
        PRINT 'Created ROLE_UI_CONFIG table.';
      END
      ELSE
      BEGIN
        PRINT 'ROLE_UI_CONFIG table already exists.';
      END
    `);

    // 2. Migrate data
    await pool.request().query(`
      INSERT INTO ROLE_UI_CONFIG (ROLE_ID, LANDING_PAGE, ALL_TRUCKS_VIEW)
      SELECT ID, LANDING_PAGE, ALL_TRUCKS_VIEW
      FROM USERROLE UR
      WHERE (LANDING_PAGE IS NOT NULL OR ALL_TRUCKS_VIEW IS NOT NULL)
      AND NOT EXISTS (SELECT 1 FROM ROLE_UI_CONFIG RUC WHERE RUC.ROLE_ID = UR.ID);
    `);
    console.log("Migrated configuration data.");

    // 3. Drop columns from USERROLE
    await pool.request().query(`
      IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'USERROLE' AND COLUMN_NAME = 'LANDING_PAGE')
      BEGIN
        ALTER TABLE USERROLE DROP COLUMN LANDING_PAGE;
        PRINT 'Dropped LANDING_PAGE column from USERROLE.';
      END
    `);

    await pool.request().query(`
      IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'USERROLE' AND COLUMN_NAME = 'ALL_TRUCKS_VIEW')
      BEGIN
        ALTER TABLE USERROLE DROP CONSTRAINT IF EXISTS DF_USERROLE_ALL_TRUCKS_VIEW;
      END
    `);
    // NOTE: Default constraints might need dynamic drop in SQL Server, but we didn't add a named constraint for ALL_TRUCKS_VIEW in db_update previously, we used a default. Wait, in seed.sql we used `DEFAULT 'ALL' NULL`. 
    // SQL Server assigns a random name to DEFAULT constraints if not specified.
    // I will write dynamic SQL to drop the default constraint first.
    await pool.request().query(`
      DECLARE @ConstraintName nvarchar(200);
      SELECT @ConstraintName = Name 
      FROM SYS.DEFAULT_CONSTRAINTS
      WHERE PARENT_OBJECT_ID = OBJECT_ID('USERROLE') 
      AND PARENT_COLUMN_ID = (SELECT column_id FROM sys.columns WHERE NAME = N'ALL_TRUCKS_VIEW' AND object_id = OBJECT_ID(N'USERROLE'));
      
      IF @ConstraintName IS NOT NULL
      BEGIN
          EXEC('ALTER TABLE USERROLE DROP CONSTRAINT ' + @ConstraintName);
      END
      
      IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'USERROLE' AND COLUMN_NAME = 'ALL_TRUCKS_VIEW')
      BEGIN
        ALTER TABLE USERROLE DROP COLUMN ALL_TRUCKS_VIEW;
        PRINT 'Dropped ALL_TRUCKS_VIEW column from USERROLE.';
      END
    `);

    console.log("Database update completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error updating database:", err);
    process.exit(1);
  }
}

runUpdate();
