/**
 * Import primary dependencies
 */
const express = require("express");
const dotenv = require("dotenv");
const sampleData = require("./sample-data");

dotenv.config();

const app = express();
const port = process.env.MOCK_PORT;

/**
 * Used to keep all server responses consistent
 *
 * @param {Response} res
 * @param {number} status
 * @param {string} message
 */
const handleResponse = (res, status, message) => {
  res.status(status).send(message);
};

/**
 * Primary endpoint for server
 */
app.get("/template/:type/:id", (req, res) => {
  const { type, id } = req.params;

  return handleResponse(res, 200, sampleData[type][id]);
});

/**
 * Run the server on the given port, listen for
 * requests and log any errors
 */
app
  .listen(port, () => {
    console.log(`Mock Server listening on port ${port}`);
  })
  .on("error", (err) => {
    console.error("Server Error: ", err);
  });
