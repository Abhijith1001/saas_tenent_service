import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from 'cors';




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


app.use(cors());

if (!process.env.TENANT_REGISTRY_URI) {
  console.error("TENANT_REGISTRY_URI is not set. Check your .env file.");
  process.exit(1);
}
await mongoose.connect(process.env.TENANT_REGISTRY_URI);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


import tenantsRouter from "./routes/tenants.js";


app.use("/api", tenantsRouter);



app.listen(4100, () => console.log("Tenant service running on 4100"));
