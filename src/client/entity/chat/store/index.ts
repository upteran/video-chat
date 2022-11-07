import { createStore } from "effector";
import { setCookie, destroyCookie } from "nookies";
import { nanoid } from "nanoid";

// ws
import { IWsMessage } from "services/ws/types";

// chat types
import {
  Chat,
  ChatConnected,
  UserChatEv,
  ChatStateType,
  CreateChatEv,
} from "../types";

import { LoadStateStatus } from "../consts";

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
  closeChatEvent,
  toggleMobileUserList,
} from "./events";

// user
import { createUser } from "../../user/helpers";
import { logOutEvent } from "../../user/store";

const initialState = {
  chat: null,
  loadedState: LoadStateStatus.notLoaded,
  messages: [],
  messagesInfoMap: null,
  mobileUserListHide: true,
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
  .on(toggleMobileUserList, (chat) => {
    return {
      ...chat,
      mobileUserListHide: !chat.mobileUserListHide,
    };
  })
  .on(createChat, (chat) => {
    return {
      ...chat,
      loadedState: LoadStateStatus.fetching,
    };
  })
  .on(createChatWsEvent, ({ chat }, message: IWsMessage<Chat>) => {
    const { payload } = message;

    return {
      chat: payload,
      loadedState: LoadStateStatus.loaded,
      messages: [],
      messagesInfoMap: createUsersViewData(payload.users),
      mobileUserListHide: true,
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
        loadedState: LoadStateStatus.loaded,
        messages,
        messagesInfoMap: createUsersViewData(users),
        mobileUserListHide: true,
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
        ...chat,
        chat: {
          users,
          chatId,
        },
        loadedState: LoadStateStatus.loaded,
        messages,
        messagesInfoMap,
        mobileUserListHide: true,
      };
    },
  )
  .reset(logOutEvent);

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

closeChatEvent.watch(() => {
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
