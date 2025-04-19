import cron from "node-cron";

import { runScheduler } from "./src/index.ts";

console.log("🚀 DatoCMS scheduler started (local test mode)");

cron.schedule("*/1 * * * *", async () => {
  console.log(
    "⏰ Checking campaign environment switch at",
    new Date().toISOString(),
  );
  await runScheduler();
});
