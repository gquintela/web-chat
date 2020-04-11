const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

app.get("/index.html", function (req, res) {
    res.send();
});


io.on("connection", (socket) => {
    socket.emit("message", "Welcome, to the chat!\n")
    socket.broadcast.emit("message", "A new user has joined!")
    socket.on("message", (e) => {
        io.emit("message", e)
    })

    socket.on("disconnect", () => {
        io.emit("message", "a user has disconnected")
    })

    socket.on("sendLocation", (position) => {
        if (position !== undefined) {
            socket.broadcast.emit("message", `https://google.com/maps?q=${position.latitude},${position.longitude}`)
        }
    })
})

// });

server.listen(port, function () {
    console.log("Chat-App listening on port 3000!");
});