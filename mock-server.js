import express from "express";
import dotenv from "dotenv";
import sampleData from "./sample-data.js";

dotenv.config();

const app = express();
const port = process.env.MOCK_PORT;

const handleResponse = (res, status, message) => {
  res.status(status).send(message);
};

app.get("/template/:type/:id", (req, res) => {
  const { type, id } = req.params;

  return handleResponse(res, 200, sampleData[type][id]);
});

app.listen(port, () => {
  console.log(`Template Engine listening on port ${port}`);
});
