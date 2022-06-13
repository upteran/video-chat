import { createStore } from "effector";
import { setCookie, destroyCookie } from "nookies";
import { nanoid } from "nanoid";

// ws
import { IWsMessage } from "../../../services/ws/types";

// chat types
import {
  Chat,
  ChatConnected,
  UserChatEv,
  ChatStateType,
  CreateChatEv,
} from "../types";

import {
  createChatWsEvent,
  createChat,
  connectChatApi,
  connectChat,
  connectChatWsEvent,
  createChatApi,
  removeFromChatWsEvent,
  removeFromChat,
  removeChatApi,
  closeChatWsEvent,
} from "./events";

// user
import { createUser } from "../../user/helpers";

const initialState = {
  chat: null,
  isLoaded: false,
  isFetching: false,
  messages: [],
  messagesInfoMap: null,
};

const colorGenerate = () =>
  "#" + parseInt(String(Math.random() * 0xffffff)).toString(16);

const createUsersViewData = (users: Array<any>, oldState = {}) => {
  return users.reduce((res, acc) => {
    if (!res[acc.name]) {
      res[acc.name] = {
        id: acc.name,
        name: acc.name,
        color: colorGenerate(),
      };
    }
    return res;
  }, oldState);
};

export const $chatStore = createStore<ChatStateType>(initialState)
  .on(createChatWsEvent, ({ chat }, message: IWsMessage<Chat>) => {
    const { payload } = message;

    return {
      chat: payload,
      isLoaded: true,
      isFetching: false,
      messages: [],
      messagesInfoMap: createUsersViewData(payload.users),
    };
  })
  .on(
    connectChatWsEvent,
    ({ chat, messagesInfoMap }, message: IWsMessage<ChatConnected>) => {
      const {
        payload: { chatId, users, messages },
      } = message;
      return {
        chat: {
          users,
          chatId,
        },
        isLoaded: true,
        isFetching: false,
        messages,
        messagesInfoMap: createUsersViewData(users),
      };
    },
  )
  .on(
    removeFromChatWsEvent,
    ({ chat, messagesInfoMap }, message: IWsMessage<ChatConnected>) => {
      const {
        payload: { chatId, users, messages },
      } = message;
      return {
        chat: {
          users,
          chatId,
        },
        isLoaded: true,
        isFetching: false,
        messages,
        messagesInfoMap,
      };
    },
  )
  .reset(closeChatWsEvent);

const persistChatData = (token: string) => {
  setCookie(null, "chatToken", token, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
};

createChatWsEvent.watch((message) => {
  const { payload } = message;
  persistChatData(payload.chatId);
});

connectChatWsEvent.watch((message) => {
  const { payload } = message;
  persistChatData(payload.chatId);
});

closeChatWsEvent.watch(() => {
  destroyCookie(null, "chatToken");
});

createChat.watch(({ userName }: CreateChatEv) => {
  const chatId = nanoid();
  const users = createUser(userName, chatId);
  createChatApi({ chatId, users: [users] });
});

connectChat.watch(({ userName, chatId }: UserChatEv) => {
  const user = createUser(userName, chatId);
  connectChatApi({ chatId, user });
});

removeFromChat.watch(({ userName, chatId }: UserChatEv) => {
  removeChatApi({ chatId, userName });
});
