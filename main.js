const express = require("express");
const mongoose = require("mongoose");
const keys = require("./keys");

const app = express();

//------------middle ware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is the home page");
});

//----------connect to mongoose
mongoose.connect(keys.mongodb.mongoURI).then(() => {
  console.log("Connected to mongodb");
  app.listen(3000, () => console.log("App running on port 3000"));
});
