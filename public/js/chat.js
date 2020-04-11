const socket = io();

//elements
const $messageForm = document.querySelector("#message-form");
var $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $locationButton = document.querySelector("#sendLocation");

////send message
$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //disable send msg
  $messageFormButton.setAttribute("disabled", "disabled");
  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message, (callbackMsg) => {
    //enable send msg
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    console.log(callbackMsg);
  });
});

///send location
document.querySelector("#sendLocation").addEventListener("click", () => {
  // disable btn
  $locationButton.setAttribute("disabled", "disabled");
  if (!navigator.geolocation) {
    return alert("Geolocalization is not supported by your browser");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      (callbackMsg) => {
        //enable button
        $locationButton.removeAttribute("disabled");

        console.log(callbackMsg);
      }
    );
  });
});

socket.on("message", (msg) => {
  console.log(msg);
});
