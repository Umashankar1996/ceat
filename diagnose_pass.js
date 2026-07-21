import { getPool, sql } from './server/config/db.js';

async function diagnose() {
  const pool = await getPool();

  console.log('\n===== 1. PRINT_STAGE_CONFIG (Print Rules) =====');
  const psc = await pool.request().query(`
    SELECT PSC.*, AM.MODULE_NAME, AM.MODULE_CODE, VTC.VEHICLE_TYPE, PTC.TEMPLATE_NAME
    FROM PRINT_STAGE_CONFIG PSC
    LEFT JOIN APP_MODULES AM ON PSC.MODULE_ID = AM.MODULE_ID
    LEFT JOIN VEHICLE_TYPE_CONFIG VTC ON PSC.VEHICLE_TYPE_ID = VTC.ID
    LEFT JOIN PRINT_TEMPLATE_CONFIG PTC ON PSC.TEMPLATE_ID = PTC.ID
  `);
  console.table(psc.recordset);

  console.log('\n===== 2. PASS_SEQUENCE_CONFIG (Sequence / Numbering) =====');
  const seq = await pool.request().query(`SELECT * FROM PASS_SEQUENCE_CONFIG`);
  console.table(seq.recordset);

  console.log('\n===== 3. WORKFLOW_SEQUENCE_CONFIG (Stage order per vehicle type) =====');
  const wsc = await pool.request().query(`
    SELECT W.*, AM.MODULE_NAME, AM.MODULE_CODE, VTC.VEHICLE_TYPE
    FROM WORKFLOW_SEQUENCE_CONFIG W
    LEFT JOIN APP_MODULES AM ON W.MODULE_ID = AM.MODULE_ID
    LEFT JOIN VEHICLE_TYPE_CONFIG VTC ON W.VEHICLE_TYPE_ID = VTC.ID
    WHERE W.ISACTIVE = 1
    ORDER BY W.VEHICLE_TYPE_ID, W.SEQUENCE_ORDER
  `);
  console.table(wsc.recordset);

  console.log('\n===== 4. Recent Trucks + PASS_NUMBER =====');
  const trucks = await pool.request().query(`
    SELECT TOP 5 TM.ID, TM.REGISTRATION_NO, TM.VEHICLE_TYPE_ID, VTC.VEHICLE_TYPE,
           TM.CURRENT_MODULE_ID, AM.MODULE_NAME AS CURRENT_MODULE,
           TM.STATUS, TM.PASS_NUMBER
    FROM TRUCK_MASTER TM
    LEFT JOIN VEHICLE_TYPE_CONFIG VTC ON TM.VEHICLE_TYPE_ID = VTC.ID
    LEFT JOIN APP_MODULES AM ON TM.CURRENT_MODULE_ID = AM.MODULE_ID
    ORDER BY TM.CREATED_ON DESC
  `);
  console.table(trucks.recordset);

  console.log('\n===== 5. TRUCK_HISTORY_LOG for most recent truck =====');
  if (trucks.recordset.length > 0) {
    const recentId = trucks.recordset[0].ID;
    const hist = await pool.request()
      .input('id', sql.UniqueIdentifier, recentId)
      .query(`
        SELECT THL.MODULE_ID, AM.MODULE_NAME, AM.MODULE_CODE, THL.ACTION_BY, THL.TIMESTAMP, THL.NOTES
        FROM TRUCK_HISTORY_LOG THL
        LEFT JOIN APP_MODULES AM ON THL.MODULE_ID = AM.MODULE_ID
        WHERE THL.TRUCK_ID = @id
        ORDER BY THL.TIMESTAMP ASC
      `);
    console.log(`History for truck: ${trucks.recordset[0].REGISTRATION_NO}`);
    console.table(hist.recordset);

    // Now simulate the check: does completing any of these modules trigger a pass?
    console.log('\n===== 6. Simulating pass-trigger check for each history module =====');
    const vtId = trucks.recordset[0].VEHICLE_TYPE_ID;
    for (const h of hist.recordset) {
      const trigger = await pool.request()
        .input('vtId', sql.Int, vtId)
        .input('mid', sql.Int, h.MODULE_ID)
        .query(`
          SELECT TOP 1 PSC.ID, AM.MODULE_NAME, PTC.TEMPLATE_NAME
          FROM PRINT_STAGE_CONFIG PSC
          LEFT JOIN APP_MODULES AM ON PSC.MODULE_ID = AM.MODULE_ID
          LEFT JOIN PRINT_TEMPLATE_CONFIG PTC ON PSC.TEMPLATE_ID = PTC.ID
          WHERE PSC.MODULE_ID = @mid AND PSC.ISACTIVE = 1 
            AND (PSC.VEHICLE_TYPE_ID = @vtId OR PSC.VEHICLE_TYPE_ID IS NULL)
        `);
      const match = trigger.recordset[0];
      console.log(`  Module ${h.MODULE_ID} (${h.MODULE_CODE || h.MODULE_NAME}): ${match ? `✅ TRIGGERS PASS (template: ${match.TEMPLATE_NAME})` : '❌ No trigger'}`);
    }
  }

  console.log('\n===== 7. APP_MODULES (All modules and their IDs) =====');
  const mods = await pool.request().query(`SELECT MODULE_ID, MODULE_CODE, MODULE_NAME FROM APP_MODULES ORDER BY MODULE_ID`);
  console.table(mods.recordset);

  process.exit(0);
}

diagnose().catch(e => { console.error(e); process.exit(1); });
