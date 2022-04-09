import { WebSocketServer } from "ws";
import { nanoid } from "nanoid";

const wss = new WebSocketServer({ port: 8000 });

type MethodsType = {
  [key: string]: (data: any) => void;
};

const messageHandlers = (type: string, data: any, ws: any) => {
  const methods: MethodsType = {
    addUser: (data) => {
      ws.send({ token: nanoid() });
      ws.send(data.toString());
    },
    sendMessage: (data) => {
      ws.send(data.toString());
    },
    defaultAction: (data) => {
      ws.send(data.toString());
    },
  };

  return (methods[type] || methods.defaultAction)(data);
};

type ClientType = {
  clientId: string;
  socket: any;
};

const clients: Array<ClientType> = [];

function addConnection(socket: any, arr: Array<ClientType>) {
  const clientId = nanoid();
  arr.push({
    clientId,
    socket,
  });
}

wss.on("connection", function connection(ws) {
  addConnection(ws, clients);
  ws.on("message", function message(data) {
    console.log("received: %s", data);
    const d: any = JSON.stringify(data.toString());
    messageHandlers(d?.method, data, ws);
  });
});

wss.on("error", (err) => {
  console.log("error", err);
});

wss.on("close", (msg: any) => {
  console.log("close", msg);
});
