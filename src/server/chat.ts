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

let activeChat: any = {
  chatId: null,
  users: [],
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
        socket.send(JSON.stringify(data));
      });
    },
    createChat: (data, clients) => {
      clients.forEach(({ socket }) => {
        socket.send(JSON.stringify(data));
      });
      activeChat = data.params;
    },
    connectChat: (data, clients) => {
      console.log("data.params activeChat", activeChat);
      activeChat = {
        chatId: activeChat.chatId,
        users: [...activeChat.users, data.params.user],
      };
      console.log({
        ...data,
        params: {
          ...activeChat,
        },
      });
      clients.forEach(({ socket }) => {
        socket.send(
          JSON.stringify({
            ...data,
            params: {
              ...activeChat,
            },
          }),
        );
      });
    },
    sendMessage: (data, clients) => {
      clients.forEach(({ socket }) => {
        socket.send(JSON.stringify(data));
      });
    },
    defaultAction: (data, clients) => {
      clients.forEach(({ socket }) => {
        socket.send(JSON.stringify(data));
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
    const d: any = data.toString();
    const parsed = JSON.parse(d);
    messageHandlers(parsed?.method, parsed, ws, clients);
  });
});

wss.on("error", (err) => {
  console.log("error", err);
});

wss.on("close", (msg: any) => {
  console.log("close", msg);
});
