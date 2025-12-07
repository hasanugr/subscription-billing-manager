import "dotenv/config";
import express from "express";
import cors from "cors";

import { env } from "./config/env";
import { apiRouter } from "./routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

// API root
app.use("/api", apiRouter);

// Error handling middleware
app.use(errorMiddleware);

app.listen(env.PORT, () => {
  console.log(
    `[api] Server is running on http://localhost:${env.PORT}/api/health`
  );
});
