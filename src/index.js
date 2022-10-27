require("dotenv").config();

const express = require("express");
const https = require("https");
const fs = require("fs");
const morgan = require("morgan");
const mongoose = require("mongoose");
const socket = require("socket.io");
const path = require("path");
const cors = require("cors");

// ssl certificate
// ca_bundle.crt
// certificater.crt
const options = {
  ca: fs.readFileSync("ca_bundle.crt", {
    encoding: "utf-8",
  }),
  cert: fs.readFileSync("certificate.crt", {
    encoding: "utf-8",
  }),
  key: fs.readFileSync("private.key", {
    encoding: "utf-8",
  }), 
};

const expressApp = express();
const app = require('https').createServer(options, expressApp);
const io = socket(app);


/**
 * Database setup
 */
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
});

expressApp.use(cors());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(morgan("dev"));
expressApp.use(express.static(path.resolve(__dirname, "..", "public")));

expressApp.use(require("./routes"));

io.on("connection", (socket) => {
  socket.on("addNewTodo", (data) => {
    socket.broadcast.emit("addNewTodo", data); 
  });

  socket.on("deleteTodo", (data) => {
    console.log(Date.now(), data);
    socket.broadcast.emit("deleteTodo", data);
  });

  socket.on("login", (user) => {
    socket.broadcast.emit("login", user);
  });
});

app.listen(process.env.PORT || 443  , () => {
  console.clear();
  console.log(
    `Server started on port ${process.env.APP_URL && process.env.APP_URL}:${process.env.PORT || 443 }/`
  );
});
