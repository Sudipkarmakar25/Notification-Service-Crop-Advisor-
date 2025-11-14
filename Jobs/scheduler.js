import cron from "node-cron";
import { processAllPlotsSequentially } from "../controllers/adviceController.js";

export function startScheduler() {
  console.log("🕒 Scheduler initialized — waiting for next run...");

//   cron.schedule("0 9 * * *", async () => {
//     console.log("🌾 Starting scheduled crop advisory job...");
//     await processAllPlotsSequentially();
//   }, {
//     scheduled: true,
//     timezone: "Asia/Kolkata"
//   });/

cron.schedule("* * * * *", async () => {
  console.log("🧪 [TEST MODE] Running crop advisory job every minute...");
  await processAllPlotsSequentially();
}, { timezone: "Asia/Kolkata" });

}
