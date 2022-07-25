import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

var corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

const handleResponse = (res, status, message) => {
  res.status(status).send(message);
};

app.post("/resolve", async (req, res) => {
  const { input } = req.body;

  if (typeof input != "string") {
    return handleResponse(
      res,
      400,
      "Input must be provided and must be a string"
    );
  }

  const rgx = new RegExp(/(\$\([a-z]{4,}:[0-9]\))/g);
  const matches = input.match(rgx);

  if (!matches) return handleResponse(res, 200, input);
  let output = input;

  Promise.all(
    matches.map(async (match) => {
      const tag = await replaceTag(match);
      output = output.replace(match, tag);
    })
  ).then(() => {
    return handleResponse(res, 200, output);
  });
});

app.listen(port, () => {
  console.log(`Template Engine listening on port ${port}`);
});

const replaceTag = (match) => {
  return new Promise(async (resolve, reject) => {
    const [name, value] = match.split(/[$()]/)[2].split(":");

    try {
      const response = await fetchTag(name, value);
      resolve(response.data);
    } catch (err) {
      console.log("Error repacing tag", err);
      reject(err);
    }
  });
};

const fetchTag = (name, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `${process.env.EXISTING_MICROSERVICE_URL}/template/${name}/${value}`
      );

      resolve(response);
    } catch (err) {
      console.log("Error fetching tag", err);
      reject(err);
    }
  });
};
