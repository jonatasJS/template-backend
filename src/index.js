require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const socket = require("socket.io");
const path = require("path");
const cors = require("cors");

const expressApp = express();
const app = require('http').createServer(expressApp);
const io = socket(app);


/**
 * Database setup
 */
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
});

expressApp.use(cors({
  origin: [
    "http://localhost:3000",
    "*",
    "https://avisos-nextjs.vercel.app",
    "https://avisos.jonatas.app"
  ]
}));
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

app.listen(process.env.PORT || 80, () => {
  console.clear();
  console.log(
    `Server started on port ${process.env.APP_URL && process.env.APP_URL}:${process.env.PORT || 80}/`
  );
});
