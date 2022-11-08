interface IServerChat {
  chatId: string;
  users: Array<object>;
}

type addChatMessageT = {
  chatId: string;
  users: Array<object>;
};

export type MessageT = {
  payload: {
    userId: string;
    messageId: string;
    message: string;
    chatId: string;
  };
};

// TODO: add logger to method steps
class ChatController {
  chats: Map<string, IServerChat>;
  logger: any;
  messages: { [key: string]: Array<object> };

  constructor() {
    this.chats = new Map();
    this.logger = null;
    this.messages = {};
  }

  initLogger(logger: any) {
    this.logger = logger;
  }

  get chatList() {
    return [...Array.from(this.chats.values())];
  }

  addChat(data: addChatMessageT) {
    const { chatId, users } = data;
    this.chats.set(chatId, { chatId, users });
    this.logger.info(
      { chatList: this.chatList },
      `Process: add ${chatId} chat to list of chats}`,
    );
    this.messages[chatId] = [];
  }

  addUserToChat({ chatId, user }: { chatId: string; user: object }): any {
    const chat = this.chats.get(chatId);
    if (!chat) {
      this.logger.error(
        { chatList: this.chatList },
        `Error in addUserToChat, couldn't find ${chatId} chat`,
      );
      return null;
    }
    // TODO: replace check to id
    // @ts-ignore
    const isUserExist = chat.users.find(({ name }) => name === user.name);
    if (!isUserExist) {
      chat?.users.push(user);
    }
    return {
      ...chat,
      messages: this.messages[chatId],
    };
  }

  removeUserFromChat({
    chatId,
    userName,
  }: {
    chatId: string;
    userName: string;
  }): any {
    const chat = this.chats.get(chatId);
    if (!chat) {
      this.logger.error(
        { chatList: this.chatList },
        `Error in removeUserFromChat, couldn't find ${chatId} chat`,
      );
      return null;
    }
    // TODO: replace check to id
    chat.users = chat.users.filter(
      // @ts-ignore
      ({ name }) => name !== userName,
    );
    return {
      ...chat,
      messages: this.messages[chatId],
    };
  }

  addMessageTo({
    chatId,
    message,
  }: {
    chatId: string;
    message: MessageT;
  }): IServerChat | null {
    const chat = this.chats.get(chatId);
    if (!chat) {
      this.logger.error(
        { chatList: this.chatList },
        `Error in addMessageTo, couldn't find ${chatId} chat`,
      );
      return null;
    }
    this.messages[chatId].push(message.payload);
    return chat;
  }
}

export const chatController = new ChatController();
