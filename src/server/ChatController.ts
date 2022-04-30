interface IServerChat {
  chatId: string;
  users: Array<object>;
}

type addChatMessageType = {
  chatId: string;
  users: Array<object>;
};

export type MessageType = {
  payload: {
    messageId: string;
    text: string;
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

  addChat(data: addChatMessageType) {
    const { chatId, users } = data;
    this.chats.set(chatId, { chatId, users });
    this.logger.info(
      this.chats,
      `Process: add ${chatId} chat to list of chats`,
    );
    this.messages[chatId] = [];
  }

  addUserToChat({ chatId, user }: { chatId: string; user: object }): any {
    const chat = this.chats.get(chatId);
    if (!chat) {
      this.logger.error(
        this.chats,
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

  removeUserFromChat({ chatId, user }: { chatId: string; user: object }): any {
    const chat = this.chats.get(chatId);
    if (!chat) {
      this.logger.error(
        this.chats,
        `Error in removeUserFromChat, couldn't find ${chatId} chat`,
      );
      return null;
    }
    // TODO: replace check to id
    const newChatUsersList = chat.users.filter(
      // @ts-ignore
      ({ name }) => name !== user.name,
    );
    return {
      ...chat,
      users: newChatUsersList,
      messages: this.messages[chatId],
    };
  }

  addMessageTo({
    chatId,
    message,
  }: {
    chatId: string;
    message: MessageType;
  }): IServerChat | null {
    const chat = this.chats.get(chatId);
    if (!chat) {
      this.logger.error(
        this.chats,
        `Error in addMessageTo, couldn't find ${chatId} chat`,
      );
      return null;
    }
    this.messages[chatId].push(message.payload);
    return chat;
  }
}

export const chatController = new ChatController();
