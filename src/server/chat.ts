import { WebSocketServer } from "ws";
import { CustomWebSocket, socketController } from "./SocketsController";
import { chatController } from "./ChatController";
import { logger } from "./logger";

const wss = new WebSocketServer({ port: 8000 });

socketController.initLogger(logger);
chatController.initLogger(logger);

type MethodsType = {
  [key: string]: (data: any) => void;
};

const messageHandlers = (type: string, data: any, ws: any) => {
  const methods: MethodsType = {
    createChat: (data) => {
      logger.info(`Handle create chat message`);
      socketController.checkChatExist(ws, data.payload.chatId);
      chatController.addChat(data.payload);
      socketController.sendMsgToClients(data.payload.chatId, data, {
        toSelf: true,
        currWsId: ws.clientId,
      });
    },
    connectChat: (data) => {
      const chatData = chatController.addUserToChat({
        chatId: data.payload.chatId,
        user: data.payload.user,
      });
      if (!chatData) return;
      socketController.checkChatExist(ws, data.payload.chatId);
      socketController.sendMsgToClients(
        data.payload.chatId,
        {
          ...data,
          payload: {
            ...chatData,
          },
        },
        { toSelf: true, currWsId: ws.clientId },
      );
    },
    removeFromChat: (data) => {
      const chatData = chatController.removeUserFromChat({
        chatId: data.payload.chatId,
        userName: data.payload.userName,
      });
      if (!chatData) return;
      socketController.checkChatExist(ws, data.payload.chatId);
      socketController.sendMsgToClients(
        data.payload.chatId,
        {
          ...data,
          payload: {
            ...chatData,
          },
        },
        { toSelf: true, currWsId: ws.clientId },
      );
      socketController.sendMsgToClient({
        clientId: ws.clientId,
        msg: {
          id: "123",
          method: "closeChat",
          payload: {},
        },
      });
    },
    updateMessagesList: (data) => {
      socketController.sendMsgToClients(data.payload.chatId, data, {
        toSelf: true,
        currWsId: ws.clientId,
      });
      chatController.addMessageTo({
        chatId: data.payload.chatId,
        message: data,
      });
    },
    connectPeers: (data) => {
      socketController.sendMsgToClients(data.payload.chatId, data, {
        toSelf: false,
        currWsId: ws.clientId,
      });
    },
    defaultAction: (data) => {
      socketController.sendMsgToClients(data.payload.chatId, data, {
        toSelf: true,
        currWsId: ws.clientId,
      });
    },
  };

  return (methods[type] || methods.defaultAction)(data);
};

wss.on("connection", function connection(ws) {
  //@ts-ignore
  socketController.addSocket(ws);

  ws.on("message", function message(data) {
    const d: any = data.toString();
    const parsed = JSON.parse(d);
    //@ts-ignore
    if (parsed?.payload?.chatId && ws?.clientId) {
      messageHandlers(parsed?.method, parsed, ws);
    } else {
      logger.info(`Dead request`);
    }
  });

  ws.on("close", () => {
    // @ts-ignore
    const extWs = ws as CustomWebSocket;
    if (extWs?.clientId) {
      logger.info(`Remove ${extWs.clientId} from active sockets`);
      socketController.removeSocket(extWs);
    }
  });
});

wss.on("error", (err) => {
  console.log("error", err);
});

wss.on("close", (msg: any) => {
  console.log("close", msg);
});
