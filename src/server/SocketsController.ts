import * as crypto from "crypto";

export type ClientType = {
  clientId: string;
  socket: any;
  chatId: string | null;
};

interface CustomWebSocket extends WebSocket {
  clientId: string;
}

class SocketsController {
  sockets: Map<string, ClientType>;
  chatIdsToSocket: Map<string, Set<string | unknown>>;
  logger: any;

  constructor() {
    this.sockets = new Map();
    const emptyList = new Set();
    this.chatIdsToSocket = new Map();
    this.chatIdsToSocket.set("none", emptyList);
    this.logger = null;
  }

  initLogger(logger: any) {
    this.logger = logger;
  }

  addSocket(socket: CustomWebSocket) {
    const clientId = crypto.randomBytes(16).toString("hex");
    socket.clientId = clientId;
    const data = {
      chatId: null,
      socket,
      clientId,
    };
    this.logger.info(`Create new client socket: ${clientId}`);
    // @ts-ignore
    this.sockets.set(clientId, data);
    const listWithoutChat = this.chatIdsToSocket.get("none");
    listWithoutChat?.add(clientId);
  }

  checkChatExist(socket: CustomWebSocket, chatId: string) {
    const s = this.sockets.get(socket.clientId);
    if (s && !s.chatId) {
      this.logger.info(`Add ${chatId} chat id to socket: ${socket.clientId}`);
      const data = {
        chatId,
        socket,
        clientId: socket.clientId,
      };
      this.sockets.set(socket.clientId, data);
      let chatSet: any = new Set();
      if (this.chatIdsToSocket.get(chatId)) {
        chatSet = this.chatIdsToSocket.get(chatId);
      }
      chatSet.add(socket.clientId);
      this.chatIdsToSocket.set(chatId, chatSet);
      this.logger.info(chatSet, `Created chat sockets ids list`);
    }
  }

  sendMsgToClients(chatId: string, msg: any) {
    const ids = this.chatIdsToSocket.get(chatId);
    if (!ids) {
      this.logger.info(
        msg,
        `Couldn't send message to any client, noa ${chatId} id`,
      );
      return;
    }
    for (const clientId of ids) {
      this.logger.info(msg, `Send message to ${clientId} client`);
      // @ts-ignore
      const s = this.sockets.get(clientId);
      s?.socket.send(JSON.stringify(msg));
    }
  }
}

export const socketController = new SocketsController();
