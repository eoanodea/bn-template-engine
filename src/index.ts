/**
 * Import primary dependencies
 */
import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config(); // for environment variables

/**
 * Resolve tags module
 */
import { resolveTags } from "./tag-controller";

/**
 * Declare express app
 */
const app: Application = express();
const port = process.env.PORT;

/**
 * Set server to parse JSON requests
 */
app.use(express.json());

/**
 * Enable and configure CORS
 */
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200, // For legacy browser support
};
app.use(cors(corsOptions));

/**
 * Just used to keep all server responses consistent
 * and keep our code nice & tidy
 *
 * @param {Response} res
 * @param {number} status
 * @param {string} message
 */
const handleResponse = (res: Response, status: number, message: string) => {
  res.status(status).send(message);
};

/**
 * Primary endpoint for server
 */
app.post("/resolve", (req: Request, res: Response) => {
  const { input } = req.body;

  if (typeof input !== "string") {
    // input validation
    return handleResponse(
      res,
      400,
      "Input must be provided and must be a string"
    );
  }
  const resolvedTags = {};
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
  .on("error", (err: Error) => {
    console.error("Server Error: ", err);
  });
