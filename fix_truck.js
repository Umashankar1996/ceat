import pkg from "mssql";
const sql = pkg;
import { getPool } from "./server/config/db.js";

async function fixStuckTruck() {
  try {
    const pool = await getPool();
    const truckId = "F8B27A71-C901-4F3F-8E57-C2A68B5550F9";
    
    // Check its current state
    const result = await pool.request()
      .input("id", sql.UniqueIdentifier, truckId)
      .query(`SELECT CURRENT_MODULE_ID, CURRENT_SEQUENCE_ORDER FROM TRUCK_MASTER WHERE ID = @id`);
    
    console.log("Current state:", result.recordset[0]);

    // Update it to Weighment (moduleId: 6, sequenceOrder: 6) which is the step after Loading
    await pool.request()
      .input("id", sql.UniqueIdentifier, truckId)
      .query(`
        UPDATE TRUCK_MASTER 
        SET CURRENT_MODULE_ID = 6, 
            CURRENT_SEQUENCE_ORDER = 6 
        WHERE ID = @id
      `);
      
    console.log("Truck successfully moved to Weighment stage!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

fixStuckTruck();
