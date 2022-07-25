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

app.post("/resolve", (req, res) => {
  const { input } = req.body;

  if (typeof input != "string") {
    return handleResponse(res, 400, "Input must be a string");
  }

  const rgx = new RegExp(/(\$\([a-z]{4,}:[0-9]\))/g);
  const matches = input.match(rgx);

  if (!matches) return handleResponse(res, 200, input);
  let output = input;
  //   console.log(`matches ${matches}`);
  matches.forEach((match, index) => {
    // const testi = match.split(/[$()]/);

    const [name, value] = match.split(/[$()]/)[2].split(":");

    fetchTag(name, value)
      .then((response) => {
        // console.log(output.replace(match, response.data));

        if (index === matches.length - 1) {
          console.log("running", index, matches.length, output);
          return handleResponse(res, 200, output.replace(match, response.data));
        }
        output = output.replace(match, response.data);
      })
      .catch(() => {
        return handleResponse(
          res,
          500,
          "The server encountered and error, please try again later"
        );
      });
  });
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
