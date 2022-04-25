import { createStore } from "effector";
import { setCookie } from "nookies";
import { nanoid } from "nanoid";

// ws
import { wsService } from "../../../services/ws";
import { WsMessageType } from "../../../services/ws/types";
import { buildCreateChatMsg, buildConnectChatMsg } from "./wsMsgBuilders";
import {
  createChatWsEvent,
  createChat,
  connectChat,
  connectChatWsEvent,
  connectChatEventType,
  createEventType,
} from "./events";

// chat
import { IChat, IChatConnected } from "../types";
import { ChatStateType } from "../types";

// user
import { createUser } from "../../users/helpers";

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

      // move to watch or another method
      setCookie(null, "chatToken", payload.chatId, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
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

      // move to watch or another method
      // setCookie(null, "chatToken", params.chatId, {
      //   maxAge: 30 * 24 * 60 * 60,
      //   path: "/",
      // });
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
