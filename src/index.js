const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const badWordsSpanish = require("./badWordsSpanish")

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
filter.addWords(...badWordsSpanish)

io.on("connection", (socket) => {
    socket.emit("message", "Welcome, to the chat!\n");
    socket.broadcast.emit("message", "A new user has joined!");


    socket.on("sendMessage", (msg, callback) => {
        msg = filter.clean(msg);
        io.emit("message", msg);
        callback("\nserver: Message Sent");
    });

    socket.on("disconnect", () => {
        io.emit("message", "a user has disconnected");
    });

    socket.on("sendLocation", (position, callback) => {
        if (position !== undefined) {
            socket.broadcast.emit(
                "message",
                `https://google.com/maps?q=${position.latitude},${position.longitude}`
            );
            callback("Server: Location recieved.")
        }
    });
});

// });

server.listen(port, function () {
    console.log("Chat-App listening on port 3000!");
});