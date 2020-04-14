const socket = io();

//elements
const $messageForm = document.querySelector("#message-form");
var $messageFormInput = $messageForm.querySelector("textarea");
const $messageFormButton = $messageForm.querySelector("button");
const $locationButton = document.querySelector("#sendLocation");
const $messages = document.querySelector("#messages");

///templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

///options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

$messageFormInput.focus();

const autoscroll = () => {
  const $newMessage = $messages.lastElementChild;
  ///height of $newMessage
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  //visible height
  const visibleHeight = $messages.offsetHeight;

  ///height of message container
  const containerHeight = $messages.scrollHeight;

  // how far have i scrolled
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight >= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

////send message
$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //disable send msg
  $messageFormButton.setAttribute("disabled", "disabled");
  const message = e.target.elements.message.value;
  if (message == "") {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.focus();
    return null;
  }
  socket.emit("sendMessage", message, (callbackMsg) => {
    //enable send msg
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.focus();
    $messageFormInput.value = "";
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
  // console.log(msg);
  const html = Mustache.render(messageTemplate, {
    username: msg.username,
    message: msg.text,
    createdAt: moment(msg.createdAt).format("MMM Do - H:mm A"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", (msg) => {
  console.log(msg.url);
  const html = Mustache.render(locationTemplate, {
    username: msg.username,
    url: msg.url,
    createdAt: moment(msg.createdAt).format("MMM Do - H:mm A"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, { room, users });
  document.querySelector("#sidebar").innerHTML = html;
});
