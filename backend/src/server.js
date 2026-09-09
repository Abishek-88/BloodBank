import dotenv from "dotenv";
import http from "http";

import app from "./app.js";
import { testConnection } from "./config/db.js";
import { initSocketServer } from "./sockets/index.js";

dotenv.config();

const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = initSocketServer(server);

app.set("io", io);

const startServer = async () => {
  await testConnection();
  server.listen(port, () => {
    console.log(`MediLink API running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});