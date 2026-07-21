import { getPool, sql } from "./server/config/db.js";

async function run() {
  const pool = await getPool();
  try {
    const integrations = [
      {
        name: "ANPR_CHECKIN",
        displayName: "ANPR Check-In Camera",
        description: "Fetch live vehicle plates from the main entrance ANPR camera",
        url: "http://10.65.56.51/API/AI/Plates",
        method: "GET",
        headers: JSON.stringify({ Authorization: "Basic YWRtaW46YWRtaW4=" })
      },
      {
        name: "ANPR_CHECKOUT",
        displayName: "ANPR Check-Out Camera",
        description: "Fetch live vehicle plates from the exit gate ANPR camera",
        url: "http://10.65.56.52/API/AI/Plates",
        method: "GET",
        headers: JSON.stringify({ Authorization: "Basic YWRtaW46YWRtaW4=" })
      },
      {
        name: "SAP_WEIGHMENT",
        displayName: "SAP Weighment Sync",
        description: "Push TouchPoint weighbridge data to SAP",
        url: "",
        method: "POST",
        headers: JSON.stringify({ Authorization: "Basic VHlyZVBvcnRhbDpDZWF0QDIwMjY=", "Content-Type": "application/json" })
      }
    ];

    for (const intg of integrations) {
      await pool.request()
        .input("name", sql.VarChar, intg.name)
        .input("displayName", sql.NVarChar, intg.displayName)
        .input("desc", sql.NVarChar, intg.description)
        .input("url", sql.NVarChar, intg.url)
        .input("method", sql.VarChar, intg.method)
        .input("headers", sql.NVarChar, intg.headers)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM API_CONFIGURATION WHERE INTEGRATION_NAME = @name)
          BEGIN
            INSERT INTO API_CONFIGURATION (INTEGRATION_NAME, DISPLAY_NAME, DESCRIPTION, API_URL, HTTP_METHOD, HEADERS_JSON, ISACTIVE)
            VALUES (@name, @displayName, @desc, @url, @method, @headers, 0)
          END
          ELSE
          BEGIN
            UPDATE API_CONFIGURATION 
            SET DISPLAY_NAME = @displayName, DESCRIPTION = @desc
            WHERE INTEGRATION_NAME = @name
          END
        `);
    }

    console.log("Missing APIs seeded into API_CONFIGURATION!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
