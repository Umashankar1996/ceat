import fs from "fs";
import path from "path";

const rootSeedFile = path.resolve("seed.sql");
const masterSeedFile = path.resolve("server", "seeders", "seed.sql");

// Read the content of the root seed.sql
const contentToAppend = fs.readFileSync(rootSeedFile, "utf-8");

// Append to the master seed.sql
fs.appendFileSync(masterSeedFile, "\n\n" + contentToAppend);

// Delete the root seed.sql
fs.unlinkSync(rootSeedFile);

console.log("Successfully migrated seed data to server/seeders/seed.sql and deleted root seed.sql");
