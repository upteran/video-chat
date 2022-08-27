export type ClientType = {
  clientId: string;
  socket: any;
  // chatId: string | null;
};

export interface CustomWebSocket extends WebSocket {
  clientId: string;
}

class SocketsController {
  sockets: Map<string, ClientType>;
  chatIdsToSocket: Map<string, Set<string | unknown>>;
  logger: any;

  constructor() {
    this.sockets = new Map();
    // const emptyList = new Set();
    this.chatIdsToSocket = new Map();
    // this.chatIdsToSocket.set("none", emptyList);
    this.logger = null;
  }

  get socketsList() {
    return [...Array.from(this.sockets.keys())];
  }

  get socketListFullData() {
    return this.sockets;
  }

  get chatsIds() {
    return [...Array.from(this.chatIdsToSocket.keys())];
  }

  initLogger(logger: any) {
    this.logger = logger;
  }

  removeSocket(socket: CustomWebSocket) {
    const cid = socket.clientId;
    if (!cid) return;
    this.sockets.delete(cid);

    this.logger.info({ list: this.socketsList }, `List of active socket`);
    // TODO: add new data format to able remove socketId from chatIdsToSocket
    // chat = chatIdsToSocket.get(); chat.removeSocket();
    return this.sockets;
  }

  addSocket(socket: CustomWebSocket, clientId: string) {
    socket.clientId = clientId;
    const data = {
      chatId: null,
      socket,
      clientId, // TODO: del, client id exist in socket param
    };
    this.logger.info(`Create new client socket: ${clientId}`);
    // @ts-ignore
    this.sockets.set(clientId, data);

    this.logger.info({ list: this.socketsList }, `List of active socket`);
    return this.sockets;
  }

  connectChatWithSocket(socket: CustomWebSocket, chatId: string) {
    const chat = this.chatIdsToSocket.get(chatId);
    if (!chat?.has(socket.clientId)) {
      this.logger.info(`Add ${chatId} chat id to socket: ${socket.clientId}`);
      let chatSet: any = new Set();
      if (this.chatIdsToSocket.get(chatId)) {
        chatSet = this.chatIdsToSocket.get(chatId);
      }
      chatSet.add(socket.clientId);
      this.chatIdsToSocket.set(chatId, chatSet);
      this.logger.info(
        { socketList: [...Array.from(chatSet.values())] },
        `Created chat sockets ids list`,
      );
    }
  }

  removeChatFromSocket(socket: CustomWebSocket, chatId: string) {
    const chat = this.chatIdsToSocket.get(chatId);
    if (chat?.has(socket.clientId)) {
      chat.delete(socket.clientId);
      if (!chat.size) {
        this.chatIdsToSocket.delete(chatId);
      }
    }
  }

  sendMsgToClients(
    chatId: string,
    msg: any,
    { toSelf, currWsId }: { toSelf: boolean; currWsId: string },
  ) {
    const ids = this.chatIdsToSocket.get(chatId);
    if (!ids) {
      this.logger.info(
        { message: msg },
        `Couldn't send message to any client, noa ${chatId} id`,
      );
      this.logger.info({ chats: this.chatIdsToSocket });
      return;
    }
    for (const clientId of ids) {
      this.logger.info(
        { requestMessage: msg },
        `Send message to ${clientId} client`,
      );

      if (toSelf || (!toSelf && currWsId !== clientId)) {
        // @ts-ignore
        const s = this.sockets.get(clientId);
        s?.socket.send(JSON.stringify(msg));
      }
    }
  }

  sendMsgToClient({ clientId, msg }: { clientId: string; msg: object }) {
    const s = this.sockets.get(clientId);
    s?.socket.send(JSON.stringify(msg));
  }
}

export const socketController = new SocketsController();
