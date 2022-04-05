import { WebSocketServer } from "ws";
import { nanoid } from "nanoid";

const wss = new WebSocketServer({ port: 8000 });

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data) {
    console.log("received: %s", data);
    if (data?.method === "sendUserData") {
      ws.send({ token: nanoid() });
      return;
    }
    ws.send(data.toString());
  });
});

wss.on("error", (err) => {
  console.log("error", err);
});

wss.on("close", (msg: any) => {
  console.log("close", msg);
});
