import { WebSocketServer } from "ws";
import pino from "pino";
import { socketController } from "./SocketsController";
import { chatController } from "./ChatController";

const logger = pino();

const wss = new WebSocketServer({ port: 8000 });

socketController.initLogger(logger);
chatController.initLogger(logger);

type MethodsType = {
  [key: string]: (data: any) => void;
};

const messageHandlers = (type: string, data: any) => {
  const methods: MethodsType = {
    createChat: (data) => {
      logger.info(`Handle create chat message`);
      socketController.sendMsgToClients(data.payload.chatId, data);
      chatController.addChat(data.payload);
    },
    connectChat: (data) => {
      const chatData = chatController.addUserToChat({
        chatId: data.payload.chatId,
        user: data.payload.user,
      });
      socketController.sendMsgToClients(data.payload.chatId, {
        ...data,
        payload: {
          ...chatData,
        },
      });
    },
    updateMessagesList: (data) => {
      socketController.sendMsgToClients(data.payload.chatId, data);
      chatController.addMessageTo({
        chatId: data.payload.chatId,
        message: data,
      });
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
