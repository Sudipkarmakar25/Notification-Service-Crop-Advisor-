import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import { startScheduler } from "./Jobs/scheduler.js";
import { getAllPlotwiseMessages } from "./controllers/getAllPlotwiseMessage.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectDB().catch((err) => {
  console.error("MongoDB connection failed:", err.message);
});


app.get("/", (_req, res) => res.json({ status: "ok", message: "Server running" }));
app.get("/api/messages/:plotId", getAllPlotwiseMessages);

var ch=1;
if(ch==0){
startScheduler();
}

const PORT = process.env.PORT || 4009;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
