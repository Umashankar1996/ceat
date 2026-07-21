import { getPool } from './server/config/db.js';

async function run() {
  const pool = await getPool();
  try {
    console.log("Creating SAP_ENTRY_MATERIALS table...");
    await pool.request().query(`
      IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'SAP_ENTRY_MATERIALS')
      BEGIN
        CREATE TABLE SAP_ENTRY_MATERIALS (
          ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
          TRUCK_ID UNIQUEIDENTIFIER NOT NULL,
          PO_NUMBER NVARCHAR(100) NULL,
          DO_NUMBER NVARCHAR(100) NULL,
          MATERIAL_CODE NVARCHAR(100) NULL,
          MATERIAL_NAME NVARCHAR(300) NULL,
          QUANTITY DECIMAL(18,4) NULL,
          UOM NVARCHAR(50) NULL,
          INVOICE_NO NVARCHAR(100) NULL,
          CREATED_AT DATETIME NOT NULL DEFAULT GETDATE(),
          CONSTRAINT FK_SAP_ENTRY_MATERIALS_TRUCK FOREIGN KEY (TRUCK_ID) REFERENCES TRUCK_MASTER(ID)
        )
      END
    `);

    console.log("Adding weighment columns to SAP_ENTRY_DATA...");
    const columnsToAdd = [
      "FIRST_WEIGHMENT DECIMAL(18,4) NULL",
      "SECOND_WEIGHMENT DECIMAL(18,4) NULL",
      "GROSS_WEIGHT DECIMAL(18,4) NULL",
      "TARE_WEIGHT DECIMAL(18,4) NULL",
      "NET_WEIGHT DECIMAL(18,4) NULL"
    ];
    for (const colDef of columnsToAdd) {
      const colName = colDef.split(" ")[0];
      await pool.request().query(`
        IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'SAP_ENTRY_DATA' AND COLUMN_NAME = '${colName}')
        BEGIN
          ALTER TABLE SAP_ENTRY_DATA ADD ${colDef};
        END
      `);
    }

    console.log("Inserting API_CONFIGURATION for SAP_GATE_ENTRY...");
    await pool.request().query(`
      IF NOT EXISTS (SELECT 1 FROM API_CONFIGURATION WHERE INTEGRATION_NAME = 'SAP_GATE_ENTRY')
      BEGIN
        INSERT INTO API_CONFIGURATION (
          INTEGRATION_NAME, DISPLAY_NAME, DESCRIPTION, API_URL, HTTP_METHOD,
          HEADERS_JSON, REQUEST_TEMPLATE_JSON, ISACTIVE
        ) VALUES (
          'SAP_GATE_ENTRY', 'SAP Gate Entry API', 'Fetches Gate Entry Details from SAP',
          'https://wddev.ceat.in:44303/RESTAdapter/TouchPointGateEntry', 'POST',
          '{"Authorization": "Basic VHlyZVBvcnRhbDpDZWF0QDIwMjY=", "Content-Type": "application/json"}',
          '{"Request":{"Header":{"Gate_Entry_Number":"{{gateEntryNumber}}"}}}', 1
        )
      END
      ELSE
      BEGIN
        UPDATE API_CONFIGURATION SET
          API_URL = 'https://wddev.ceat.in:44303/RESTAdapter/TouchPointGateEntry',
          HTTP_METHOD = 'POST',
          HEADERS_JSON = '{"Authorization": "Basic VHlyZVBvcnRhbDpDZWF0QDIwMjY=", "Content-Type": "application/json"}',
          REQUEST_TEMPLATE_JSON = '{"Request":{"Header":{"Gate_Entry_Number":"{{gateEntryNumber}}"}}}',
          ISACTIVE = 1
        WHERE INTEGRATION_NAME = 'SAP_GATE_ENTRY'
      END
    `);

    console.log("Success! Database schema updated.");
  } catch (err) {
    console.error("Error updating schema:", err);
  } finally {
    process.exit(0);
  }
}

run();
