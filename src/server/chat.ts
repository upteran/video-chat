import { WebSocketServer } from "ws";
import pino from "pino";
import { socketController } from "./createClient";

const logger = pino();

const wss = new WebSocketServer({ port: 8000 });
socketController.initLogger(logger);

type MethodsType = {
  [key: string]: (data: any) => void;
};

let activeChat: any = {
  chatId: null,
  users: [],
};

const messageHandlers = (type: string, data: any) => {
  const methods: MethodsType = {
    createChat: (data) => {
      logger.info(`Handle create chat message`);
      socketController.sendMsgToClients(data.payload.chatId, data);
      activeChat = data.payload;
    },
    connectChat: (data) => {
      logger.info(activeChat, "data.payload activeChat");
      activeChat = {
        chatId: activeChat.chatId,
        users: [...activeChat.users, data.payload.user],
      };
      socketController.sendMsgToClients(activeChat.chatId, {
        ...data,
        payload: {
          ...activeChat,
        },
      });
    },
    sendMessage: (data) => {
      socketController.sendMsgToClients(data.payload.chatId, data);
    },
    defaultAction: (data) => {
      socketController.sendMsgToClients(data.payload.chatId, data);
    },
  };

  return (methods[type] || methods.defaultAction)(data);
};

wss.on("connection", function connection(ws) {
  //@ts-ignore
  socketController.addSocket(ws);

  ws.on("message", function message(data) {
    logger.info(`received: %s ${data}`);
    const d: any = data.toString();
    const parsed = JSON.parse(d);
    //@ts-ignore
    if (parsed?.payload?.chatId && ws?.clientId) {
      //@ts-ignore
      socketController.checkChatExist(ws, parsed?.payload?.chatId);
      messageHandlers(parsed?.method, parsed);
    } else {
      // ws.send(JSON.stringify(data));
      logger.info(`Dead request`);
    }
  });
});

wss.on("error", (err) => {
  console.log("error", err);
});

wss.on("close", (msg: any) => {
  console.log("close", msg);
});
