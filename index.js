import express from "express";
const app = express();
const port = 3000;

app.use(express.json());

const handleResponse = (res, status, message) => {
  res.status(status).send({ success: status === 200, message });
};

app.post("/resolveendpoint", (req, res) => {
  const { input } = req.body;
  const rgx = new RegExp(/(\$\([a-z]{4,}:[0-9]\))/g);

  if (typeof input == "string" && rgx.test(input)) {
    const matches = input.match(rgx);
    console.log(matches);

    return handleResponse(res, 200, "Good job");
  }
  return handleResponse(
    res,
    400,
    "Input must be a string and contain at least one tag e.g. 'Hello ${firstname:1}'"
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
