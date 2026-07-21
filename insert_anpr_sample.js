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

const sampleData = [
  {
    INTEGRATION: "ANPR", TYPE: "EmployeeVehicleEntryExit", ISACTIVE: 1, MODULE: "Vehicle", HTTPVERB: "POST",
    POST_URL: "http://10.65.56.17/API/AI/SnapedObjects/SearchPlate?|http://10.65.56.18/API/AI/SnapedObjects/SearchPlate?",
    DIVISION_URL: "http://10.65.56.17/API/Web/Login|http://10.65.56.18/API/Web/Login",
    CARD_TYPE_URL: "http://10.65.56.17/API/AI/SnapedObjects/GetByIndex?|http://10.65.56.18/API/AI/SnapedObjects/GetByIndex?",
    EVENTID: null,
    ACCESSGROUP_TYPE_Url: "http://10.65.56.17/API/AI/SnapedObjects/GetById?|http://10.65.56.18/API/AI/SnapedObjects/GetById?",
    BODY_JSON_DATA: "http://10.65.56.17/API/Login/Heartbeat|http://10.65.56.18/API/Login/Heartbeat",
    ACCESS_KEY: "admin", SECRET_KEY: "admin", METHOD: "EmployeeVehicleEntryExit"
  },
  {
    INTEGRATION: "ANPR", TYPE: "EmployeeVehicleCheckIn", ISACTIVE: 1, MODULE: "Vehicle", HTTPVERB: "POST",
    POST_URL: "http://10.65.56.17/API/AI/Plates/Add|http://10.65.56.18/API/AI/Plates/Add",
    DIVISION_URL: "http://10.65.56.17/API/Web/Login|http://10.65.56.18/API/Web/Login",
    ACCESS_KEY: "admin", SECRET_KEY: "admin", METHOD: "EmployeeVehicleCheckIn"
  },
  {
    INTEGRATION: "ANPR", TYPE: "EmployeeVehicleCheckOut", ISACTIVE: 1, MODULE: "Vehicle", HTTPVERB: "POST",
    POST_URL: "http://10.65.56.17/API/AI/Plates/Remove|http://10.65.56.18/API/AI/Plates/Remove",
    DIVISION_URL: "http://10.65.56.17/API/Web/Login|http://10.65.56.18/API/Web/Login",
    ACCESS_KEY: "admin", SECRET_KEY: "admin", METHOD: "EmployeeVehicleCheckOut"
  },
  {
    INTEGRATION: "ANPR", TYPE: "EmployeeVehicleCheckInModify", ISACTIVE: 1, MODULE: "Vehicle", HTTPVERB: "POST",
    POST_URL: "http://10.65.56.17/API/AI/Plates/Modify|http://10.65.56.18/API/AI/Plates/Modify",
    DIVISION_URL: "http://10.65.56.17/API/Web/Login|http://10.65.56.18/API/Web/Login",
    ACCESS_KEY: "admin", SECRET_KEY: "admin", METHOD: "EmployeeVehicleCheckInModify"
  }
];

async function insertSamples() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log("Connected to DB.");

    for (const data of sampleData) {
      await pool.request()
        .input("int", sql.VarChar(200), data.INTEGRATION)
        .input("type", sql.VarChar(100), data.TYPE)
        .input("active", sql.Bit, data.ISACTIVE)
        .input("mod", sql.VarChar(100), data.MODULE)
        .input("verb", sql.VarChar(50), data.HTTPVERB)
        .input("post", sql.VarChar(500), data.POST_URL)
        .input("div", sql.VarChar(500), data.DIVISION_URL)
        .input("card", sql.VarChar(500), data.CARD_TYPE_URL || null)
        .input("access", sql.VarChar(500), data.ACCESSGROUP_TYPE_Url || null)
        .input("body", sql.VarChar(sql.MAX), data.BODY_JSON_DATA || null)
        .input("ack", sql.VarChar(500), data.ACCESS_KEY)
        .input("sek", sql.VarChar(500), data.SECRET_KEY)
        .input("meth", sql.VarChar(50), data.METHOD)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM API_Integration WHERE INTEGRATION = @int AND TYPE = @type)
          BEGIN
            INSERT INTO API_Integration (INTEGRATION, TYPE, ISACTIVE, MODULE, HTTPVERB, POST_URL, DIVISION_URL, CARD_TYPE_URL, ACCESSGROUP_TYPE_Url, BODY_JSON_DATA, ACCESS_KEY, SECRET_KEY, METHOD)
            VALUES (@int, @type, @active, @mod, @verb, @post, @div, @card, @access, @body, @ack, @sek, @meth)
          END
        `);
    }
    
    console.log("Sample ANPR data successfully inserted.");
    process.exit(0);
  } catch (err) {
    console.error("Error inserting data:", err);
    process.exit(1);
  }
}

insertSamples();
