const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");

let server;

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Create Mongo connection and get the express app to listen on config.port

server = app.listen(config.port, () => {
  console.log("Listening to port: " + config.port);

  mongoose
    .connect(config.mongoose.url, config.mongoose.options)
    .then(() => {
      console.log(`DB Connected on : ${config.mongoose.url}`);
    })
    .catch((e) => console.log("Error", e));
});
