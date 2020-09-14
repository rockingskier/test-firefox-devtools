import http from "http";

import express from "express";
import sockjs from "sockjs";
import WebSocket from "ws";
import { AddressInfo } from "net";

const app = express();
app.use(express.static("public"));

const server = http.createServer(app);

const wsServer = new WebSocket.Server({ path: "/ws", server });
wsServer.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log("received: %s", message);
    ws.send(message);
  });
});

const sockJsServer = sockjs.createServer();
sockJsServer.on("connection", (conn) => {
  conn.on("data", (message) => {
    console.log("received: %s", message);
    conn.write(message);
  });
});

sockJsServer.installHandlers(server, { prefix: "/sock" });

server.listen(5001, (...args) => {
  console.log(
    `Open http://localhost:${(server.address() as AddressInfo).port}`
  );
});
