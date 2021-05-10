import dotenv from "dotenv";
import mongoose from "./mongoose.js";
import express from "./express.js";
import schedule from "../carts/misc/cleanup.js";

export const start = () => {
  dotenv.config();
  mongoose.connect();
  let app = express.init();
  const port = process.env.PORT || 5000;
  app.get("/api", function (_, res) {
    res.send("Sample Shop server running.");
  });
  schedule();
  app.listen(port, () => console.log(`Server started on port ${port}`));
};

export default { start };
