import express from "express";
import { status } from "#controllers/status.controller.js";

const app = express();
const port = process.env.PORT ?? "9001";

app.get("/", (req, res) => {
  res.send("Hello world!");
  console.log("Response sent");
});

app.get("/api/v1/status", status);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
