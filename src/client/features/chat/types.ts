import { UserType } from "../user/types";
import { Message, MessagesList } from "../messages/types";

// store / chat
export interface Chat {
  chatId: string;
  users: Array<UserType>;
}

export interface ChatConnected extends Chat {
  messages: MessagesList;
}

export type ChatStateType = {
  chat: Chat | null;
  isLoaded: boolean;
  isFetching: boolean;
  messages: Array<Message>;
  messagesInfoMap: null | {
    [key: string]: {
      id: string;
      name: string;
      color: string;
    };
  };
};

// events
export type CreateChatEv = {
  userName: UserType["name"];
};

export type CreateChatPayload = Chat;

export type UserChatEv = {
  userName: UserType["name"];
  chatId: Chat["chatId"];
};

export type UserChatAdd = {
  user: UserType;
  chatId: Chat["chatId"];
};
