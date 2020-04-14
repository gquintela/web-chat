const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const badWordsSpanish = require("./badWordsSpanish");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

app.get("/index.html", function (req, res) {
  res.send();
});

const filter = new Filter();
filter.addWords(...badWordsSpanish);

io.on("connection", (socket) => {
  ///on join
  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    socket.emit("message", generateMessage("Welcome!"));
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage(`${user.username} jas joined!`));

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  //on sendMessage
  socket.on("sendMessage", (msg, callback) => {
    const user = getUser(socket.id);
    msg = filter.clean(msg);
    io.to(user.room).emit("message", generateMessage(user.username, msg));
    callback("\nserver: Message Sent");
  });

  /// on disconnect
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username} has disconnected`)
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });

  ///on sendLocation
  socket.on("sendLocation", (position, callback) => {
    const user = getUser(socket.id);
    if (position !== undefined) {
      io.to(user.room).emit(
        "locationMessage",
        generateLocationMessage(
          user.username,
          `https://google.com/maps?q=${position.latitude},${position.longitude}`
        )
      );
      callback("Server: Location recieved.");
    }
  });
});

server.listen(port, function () {
  console.log("Chat-App listening on port 3000!");
});
