// eslint-disable-next-line no-console
console.log('WebSocket client script will run here.');

const socket = new WebSocket('wss://localhost:3000');

socket.onopen = function(event) {
  socket.send("Here's some text that the server is urgently awaiting!");
};

socket.onmessage = function(event) {
  // eslint-disable-next-line no-console
  console.log(event.data);
};
