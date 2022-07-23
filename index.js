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

app.post("/resolveendpoint", (req, res) => {
  const { input } = req.body;

  const rgx = new RegExp(/(\$\([a-z]{4,}:[0-9]\))/g);

  if (typeof input == "string" && rgx.test(input)) {
    const matches = input.match(rgx);
    let output = input;

    matches.forEach((match, index) => {
      const [name, value] = match.split(/[$()]/)[2].split(":");

      fetchTag(name, value)
        .then((response) => {
          output = output.replace(match, response.data);

          if (index === matches.length - 1) {
            return handleResponse(res, 200, output);
          }
        })
        .catch(() => {
          return handleResponse(
            res,
            500,
            "The server encountered and error, please try again later"
          );
        });
    });
  } else {
    return handleResponse(
      res,
      400,
      "Input must be a string and contain at least one tag e.g. 'Hello $(firstname:1)'"
    );
  }
});

app.listen(port, () => {
  console.log(`Template Engine listening on port ${port}`);
});

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
