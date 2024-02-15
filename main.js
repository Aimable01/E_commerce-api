const express = require("express");
const mongoose = require("mongoose");
const keys = require("./keys");
const routes = require("./routes/auth-routes");

const app = express();

//------------middle ware
app.use(express.json());

app.use("/", routes);

//----------connect to mongoose
mongoose
  .connect(keys.mongodb.mongoURI)
  .then(() => {
    console.log("Connected to mongodb");
    app.listen(3000, () => console.log("App running on port 3000"));
  })
  .catch((err) => {
    console.log(`Error in mongodb connection: ${err}`);
  });
