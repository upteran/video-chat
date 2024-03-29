import express from "express";
import https from "https";
import { readFileSync } from "fs";
// @ts-ignore
import { WebSocketServer } from "ws";
// @ts-ignore
import crypto from "crypto";
import {
  CustomWebSocket,
  socketController,
} from "./src/controllers/SocketsController";
import { chatController } from "./src/controllers/ChatController";
import { logger } from "./src/logger";

// TODO: add cert to server

const port = process.env.PORT || 3000;

const app = express();
let server = null;

console.log("process.env.NODE_ENV", process.env.NODE_ENV);
if (process.env.NODE_ENV !== "production") {
  const serverConfigs = {
    cert: readFileSync("./cert.pem"),
    key: readFileSync("./cert-key.pem"),
  };

  server = https.createServer(serverConfigs, app).listen(port, () => {
    console.log(`server is running at port ${port}`);
  });
} else {
  server = app
    .use((req: any, res: any) => res.send("Hello server"))
    .listen(port, () => console.log(`Listening on ${port}`));
}

const wss = new WebSocketServer({ server });

socketController.initLogger(logger);
chatController.initLogger(logger);

type MethodsType = {
  [key: string]: (data: any) => void;
};

const messageHandlers = (type: string, data: any, ws: any) => {
  const methods: MethodsType = {
    createChat: (data) => {
      logger.info(`Handle create chat message`);
      socketController.connectChatWithSocket(ws, data.payload.chatId);
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
      socketController.connectChatWithSocket(ws, data.payload.chatId);
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
      // socketController.connectChatWithSocket(ws, data.payload.chatId);
      socketController.sendMsgToClients(
        data.payload.chatId,
        {
          ...data,
          payload: {
            ...chatData,
          },
        },
        { toSelf: false, currWsId: ws.clientId },
      );
      socketController.removeChatFromSocket(ws, data.payload.chatId);
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
    peerEvents: (data) => {
      socketController.sendMsgToClients(data.payload.chatId, data, {
        toSelf: false,
        currWsId: ws.clientId,
      });
    },
    connectClose: (data) => {
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

wss.on("connection", function connection(ws: any) {
  const clientId = crypto.randomBytes(16).toString("hex");
  //@ts-ignore
  socketController.addSocket(ws, clientId);

  ws.on("message", function message(data: any) {
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

wss.on("error", (err: any) => {
  console.log("error", err);
});

wss.on("close", (msg: any) => {
  console.log("close", msg);
});
