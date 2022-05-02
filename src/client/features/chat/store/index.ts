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
      };
    },
  )
  .on(
    // @ts-ignore
    connectChatWsEvent,
    ({ chat }, message: IWsMessage<IChatConnected>) => {
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
      };
    },
  )
  .on(
    // @ts-ignore
    removeFromChatWsEvent,
    ({ chat }, message: IWsMessage<IChatConnected>) => {
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
      };
    },
  )
  .on(
    // @ts-ignore
    closeChatWsEvent,
    () => {
      return {
        chat: null,
        isLoaded: false,
        isFetching: false,
        messages: [],
      };
    },
  );

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
