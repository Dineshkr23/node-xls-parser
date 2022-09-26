const express = require("express");
const cors = require("cors");
const port = 5000;
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

var apiv1_routes = require("./apis/routes");

app.use("/v1/", apiv1_routes);

app.use(express.static(path.join(__dirname, "files")));

app.use("*", function (req, res) {
  res.status(404).send("Requested path not found.");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
