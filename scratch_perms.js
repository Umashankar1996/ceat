import { getPool } from "./server/config/db.js";

async function run() {
  const pool = await getPool();
  try {
    const res = await pool.request().query("SELECT MODULE_ID, MODULE_CODE, MODULE_NAME FROM APP_MODULES ORDER BY MODULE_ID");
    console.log("ALL APP_MODULES:");
    res.recordset.forEach(r => console.log(`  ID=${r.MODULE_ID}  CODE=${r.MODULE_CODE}  NAME=${r.MODULE_NAME}`));
    
    const perms = await pool.request().query("SELECT TOP 20 RMM.ROLE_ID, RMM.MODULE_ID, AM.MODULE_CODE, RMM.CAN_VIEW, RMM.CAN_EDIT FROM ROLE_MODULE_MAPPING RMM INNER JOIN APP_MODULES AM ON RMM.MODULE_ID = AM.MODULE_ID WHERE RMM.ISACTIVE = 1 ORDER BY RMM.ROLE_ID, RMM.MODULE_ID");
    console.log("\nROLE_MODULE_MAPPING (first 20):");
    perms.recordset.forEach(r => console.log(`  RoleID=${r.ROLE_ID}  ModuleID=${r.MODULE_ID}  Code=${r.MODULE_CODE}  View=${r.CAN_VIEW}  Edit=${r.CAN_EDIT}`));

    const roles = await pool.request().query("SELECT ID, NAME FROM USERROLE WHERE ISACTIVE = 1 ORDER BY ID");
    console.log("\nUSERROLE:");
    roles.recordset.forEach(r => console.log(`  ID=${r.ID}  NAME=${r.NAME}`));

    const uiconf = await pool.request().query("SELECT * FROM ROLE_UI_CONFIG ORDER BY ROLE_ID");
    console.log("\nROLE_UI_CONFIG:");
    uiconf.recordset.forEach(r => console.log(`  RoleID=${r.ROLE_ID}  LandingPage=${r.LANDING_PAGE}  AllTrucksView=${r.ALL_TRUCKS_VIEW}`));
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
