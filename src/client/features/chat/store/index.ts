import { createStore } from "effector";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { nanoid } from "nanoid";

// ws
import { wsService } from "../../../services/ws";
import { IWsMessage } from "../../../services/ws/types";

import {
  createChatWsEvent,
  createChat,
  createChatReqBuilder,
  connectChat,
  connectChatWsEvent,
  connectChatWsBuilder,
  userChatET,
  createChatET,
  removeFromChatWsEvent,
  removeFromChat,
  removeChatWsBuilder,
  closeChatWsEvent,
} from "./events";

// chat
import { IChat, IChatConnected } from "../types";
import { ChatStateType } from "../types";

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
  .on(
    // @ts-ignore
    createChatWsEvent,
    ({ chat }, message: IWsMessage<IChat>) => {
      const { payload } = message;

      return {
        chat: payload,
        isLoaded: true,
        isFetching: false,
        messages: [],
        messagesInfoMap: createUsersViewData(payload.users),
      };
    },
  )
  .on(
    // @ts-ignore
    connectChatWsEvent,
    ({ chat, messagesInfoMap }, message: IWsMessage<IChatConnected>) => {
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
    // @ts-ignore
    removeFromChatWsEvent,
    ({ chat, messagesInfoMap }, message: IWsMessage<IChatConnected>) => {
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

createChat.watch(({ userName }: createChatET) => {
  const chatId = nanoid();
  const users = createUser(userName, chatId);
  const msg = createChatReqBuilder({ chatId, users: [users] });
  // @ts-ignore
  wsService.send(msg);
});

connectChat.watch(({ userName, chatId }: userChatET) => {
  const user = createUser(userName, chatId);
  const msg = connectChatWsBuilder({ chatId, user });
  // @ts-ignore
  wsService.send(msg);
});

removeFromChat.watch(({ userName, chatId }: userChatET) => {
  const msg = removeChatWsBuilder({ chatId, userName });
  // @ts-ignore
  wsService.send(msg);
});
