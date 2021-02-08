const net = require("net");
const options = require("./settings.js");

// Resume TTY input
process.stdin.resume();
process.stdin.setEncoding("utf-8");

// Init a new socket
const socket = new net.Socket();

// Connection handler
socket.on("connect", () => {
  process.stdout.write("> Connected");
  process.stdout.write("\n");
})

// Data handler
socket.on("data", (data) => {
  process.stdout.write(data.toString());
  process.stdout.write("\n");  
})

// Create connection
socket.connect(options);

// Input handler
process.stdin.on("readable", () => {
  let chunk;
  while ((chunk = process.stdin.read()) !== null) {
    chunk = chunk.replace(/(\r\n)/gi, "");
    if (chunk === ".exit") {
      socket.destroy();
      return;
    }
    socket.write(chunk);
  }
})