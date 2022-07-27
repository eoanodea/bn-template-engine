/**
 * Import primary dependencies
 */
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config(); // for environment variables

// Resolve tags module
import { resolveTags } from "./tag-controller.js";

/**
 * Declare express app
 */
const app = express();
const port = process.env.PORT;

/**
 * Set server to parse JSON requests
 */
app.use(express.json());

/**
 * Enable and configure CORS
 */
var corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200, // For legacy browser support
};
app.use(cors(corsOptions));

/**
 * Used to keep all server responses consistent
 *
 * @param {*} res
 * @param {*} status
 * @param {*} message
 */
const handleResponse = (res, status, message) => {
  res.status(status).send(message);
};

/**
 * Primary endpoint for server
 */
app.post("/resolve", (req, res) => {
  const { input } = req.body;

  if (typeof input != "string") {
    // input validation
    return handleResponse(
      res,
      400,
      "Input must be provided and must be a string"
    );
  }
  let resolvedTags = {};
  resolveTags(input, resolvedTags).then((response) =>
    handleResponse(res, 200, response)
  );
});

/**
 * Run the server on the given port, listen for
 * requests and log any errors
 */
app
  .listen(port, () => {
    console.log(`Template Engine listening on port ${port}`);
  })
  .on("error", (err) => {
    console.error("Server Error: ", err);
    return handleResponse(
      res,
      500,
      "The server has encountered an error. Please try again later"
    );
  });
