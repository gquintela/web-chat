const socket = io()


document.querySelector("#messageForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const message = e.target.elements.message.value
    socket.emit("sendMessage", message, (callbackMsg) => {
        console.log("message delivered", callbackMsg)
    })
})

document.querySelector("#sendLocation").addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("Geolocalization is not supported by your browser")
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("sendLocation", ({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }))
    })
})

socket.on("message", (msg) => {
    console.log(msg)
})