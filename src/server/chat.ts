import { WebSocketServer } from "ws";
import { nanoid } from "nanoid";

const wss = new WebSocketServer({ port: 8000 });

type ClientType = {
  clientId: string;
  socket: any;
};

type MethodsType = {
  [key: string]: (data: any, clients: Array<ClientType>) => void;
};

const messageHandlers = (
  type: string,
  data: any,
  currSocket: any,
  clients: Array<ClientType>,
) => {
  const methods: MethodsType = {
    addUser: (data, clients) => {
      clients.forEach(({ socket }) => {
        socket.send({ token: nanoid() });
        socket.send(data.toString());
      });
    },
    sendMessage: (data, clients) => {
      clients.forEach(({ socket }) => {
        socket.send(data.toString());
      });
    },
    defaultAction: (data, clients) => {
      clients.forEach(({ socket }) => {
        socket.send(data.toString());
      });
    },
  };

  return (methods[type] || methods.defaultAction)(data, clients);
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
    messageHandlers(d?.method, data, ws, clients);
  });
});

wss.on("error", (err) => {
  console.log("error", err);
});

wss.on("close", (msg: any) => {
  console.log("close", msg);
});
