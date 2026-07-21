const { getPool, sql } = require('./server/config/db.js');

async function test() {
  const pool = await getPool();
  
  // Let's manually trigger the sequence logic for the first active truck
  const truckRes = await pool.request()
    .query("SELECT TOP 1 ID, VEHICLE_TYPE_ID, PASS_NUMBER FROM TRUCK_MASTER WHERE STATUS = 'Active' ORDER BY CREATED_ON DESC");
  
  if (truckRes.recordset.length === 0) {
    console.log("No active trucks found.");
    process.exit(0);
  }
  
  const { ID: truckId, VEHICLE_TYPE_ID, PASS_NUMBER } = truckRes.recordset[0];
  console.log("Truck ID:", truckId);
  console.log("Vehicle Type ID:", VEHICLE_TYPE_ID);
  console.log("Current Pass Number:", PASS_NUMBER);
  
  // Try to find a print rule
  const printTrigger = await pool.request()
    .input("vtId", sql.Int, VEHICLE_TYPE_ID)
    // .input("mid", sql.Int, currentModuleId)
    .query(`
      SELECT * FROM PRINT_STAGE_CONFIG 
      WHERE ISACTIVE = 1 
        AND (VEHICLE_TYPE_ID = @vtId OR VEHICLE_TYPE_ID IS NULL)
    `);
    
  console.log("Print Triggers configured:", printTrigger.recordset);
  
  if (printTrigger.recordset.length > 0) {
    const currentModuleId = printTrigger.recordset[0].MODULE_ID;
    console.log("Simulating completion of module:", currentModuleId);
    
    // Check if this module triggers a print (the actual query)
    const exactTrigger = await pool.request()
        .input("vtId", sql.Int, VEHICLE_TYPE_ID)
        .input("mid", sql.Int, currentModuleId)
        .query(`
          SELECT 1 FROM PRINT_STAGE_CONFIG 
          WHERE MODULE_ID = @mid AND ISACTIVE = 1 
            AND (VEHICLE_TYPE_ID = @vtId OR VEHICLE_TYPE_ID IS NULL)
        `);
    
    console.log("Exact trigger match:", exactTrigger.recordset);
    
    if (exactTrigger.recordset.length > 0) {
      let passNumber = null;
      let seqRes = await pool.request()
        .input("vtId", sql.Int, VEHICLE_TYPE_ID)
        .query("SELECT * FROM PASS_SEQUENCE_CONFIG WHERE VEHICLE_TYPE_ID = @vtId AND ISACTIVE = 1");
      
      console.log("Sequence match by VT:", seqRes.recordset);
      
      if (seqRes.recordset.length === 0) {
        seqRes = await pool.request().query("SELECT * FROM PASS_SEQUENCE_CONFIG WHERE SCOPE = 'GLOBAL' AND ISACTIVE = 1");
        console.log("Sequence match by Global:", seqRes.recordset);
      }
      
      if (seqRes.recordset.length > 0) {
          const seq = seqRes.recordset[0];
          console.log("Sequence ID:", seq.ID);
          // Let's simulate generating pass number without updating DB
          const nextNum = seq.CURRENT_NUMBER + 1;
          const prefix = seq.PREFIX;
          const padding = seq.PADDING_LENGTH;
          passNumber = `${prefix || ''}${String(nextNum).padStart(padding || 4, '0')}`;
          
          console.log("Generated Pass Number:", passNumber);
      } else {
          console.log("No sequence configuration found!");
      }
    }
  }
  process.exit(0);
}

test().catch(e => console.error(e));
