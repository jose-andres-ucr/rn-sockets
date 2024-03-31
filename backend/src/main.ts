import express from "express";
import os from "node:os";
import http from "node:http";
import { Server } from "socket.io";

// Obtener mi IP privado
function getPrivateIP() {
  const interfaces = os.networkInterfaces();
  for (let iface in interfaces) {
    for (let alias of interfaces[iface] ?? []) {
      if (alias.family === "IPv4" && !alias.internal) {
        return alias.address;
      }
    }
  }
  return "0.0.0.0";
}

// REST
const app = express();
app.get("/", (req, res) => {
  res.send({
    message: "Qué dicha que hay vacaciones",
    test: "hola mundo!!!!!",
  });
});

const server = http.createServer(app);

const io = new Server(server);

// Sockets
io.on("connection", (socket) => {
  console.log("A user is connected");

  socket.on("message", (msg) => {
    console.log("BREAKPOINT", msg);
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("One user left");
  });
});

const port = 5000;
const host = getPrivateIP();
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
