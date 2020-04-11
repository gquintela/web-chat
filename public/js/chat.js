const socket = io()

// socket.on("countUpdated", (count) => {
//     console.log("the count has been updated", count)
// })

document.querySelector("#messageForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const message = e.target.elements.message.value
    socket.emit("message", message)
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