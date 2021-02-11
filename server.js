const net = require("net");
const options = require("./settings.js");

// Pool for clients
let sockets = [];

// Commands
const commands = {
  name(client, name) {
    name = name.toString().split(" ")[1];
    const index = sockets.indexOf(client);
    sockets[index].name = name;
  }
}

// Broadcasting
const broadcast = (client, data) => {
  sockets.forEach((el) => {
    if (el === client) return;
    el.write(client.name + ": " + data);
  })
}

// Remove disconnected client
const removeClient = (client) => {
  sockets = sockets.filter((el) => el === client);
}

// Setting quick names
const getNewClientName = () => 
  "Guest" + (Date.now() + "").slice(6)


// Init a new TCP server
const server = net.createServer((socket) => {

  // Set a new name for client socket
  socket.name = getNewClientName();

  // Append new socket
  sockets.push(socket);

  // Data handler
  socket.on("data", (data) => {
    if (data.toString()[0] === ".") {
      const command = commands[data.toString().slice(1).match(/^([\w\-]+)/gi)];
      if (command) command(socket, data);
      return;
    }

    broadcast(socket, data);
  })

  // Disconnecting
  socket.on("close", () => {
    removeClient();
  })

  // Error handler
  socket.on("error", (err) => {
    process.stdout.write("> Socket error has appeared:\n\t");
    process.stdout.write(err.toString());
    process.stdout.write("\n");
  })
})

// Start listening
server.listen(options, () => {
  process.stdout.write("> Server has started!");
  process.stdout.write("\n");
});