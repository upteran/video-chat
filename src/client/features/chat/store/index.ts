import { createStore } from "effector";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { nanoid } from "nanoid";

// ws
import { wsService } from "../../../services/ws";
import { WsMessageType } from "../../../services/ws/types";
import {
  buildCreateChatMsg,
  buildConnectChatMsg,
  buildRemoveFromChatMsg,
} from "./wsMsgBuilders";
import {
  createChatWsEvent,
  createChat,
  connectChat,
  connectChatWsEvent,
  connectChatEventType,
  createEventType,
  removeFromChatWsEvent,
  removeFromChat,
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
    ({ chat }, message: WsMessageType<IChat>) => {
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
    ({ chat }, message: WsMessageType<IChatConnected>) => {
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
    ({ chat }, message: WsMessageType<IChatConnected>) => {
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

removeFromChatWsEvent.watch(() => {
  destroyCookie(null, "chatToken");
});

createChat.watch(({ userName }: createEventType) => {
  const chatId = nanoid();
  const users = createUser(userName, chatId);
  const msg = buildCreateChatMsg(chatId, [users]);
  // @ts-ignore
  wsService.send(msg);
});

connectChat.watch(({ userName, chatId }: connectChatEventType) => {
  const user = createUser(userName, chatId);
  const msg = buildConnectChatMsg(chatId, user);
  // @ts-ignore
  wsService.send(msg);
});

removeFromChat.watch(({ userName, chatId }: connectChatEventType) => {
  const user = createUser(userName, chatId);
  const msg = buildRemoveFromChatMsg(chatId, user);
  // @ts-ignore
  wsService.send(msg);
});
