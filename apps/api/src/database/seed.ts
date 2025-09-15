import { runSeeders } from "typeorm-extension";

import { AppDataSource } from "../data-source";

AppDataSource.initialize()
  .then(async () => {
    console.log("Database initialized for seeding");

    // Run seeders
    await runSeeders(AppDataSource);

    console.log("Seeding completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
