import { createEvent, createStore } from "effector";
import { parseCookies, setCookie } from "nookies";
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
import { IChat } from "../types";
import { ChatStateType } from "../types";

// user
import { createUser } from "../../users/helpers";

const initialState = {
  chat: null,
  isLoaded: false,
  isFetching: false,
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
      };
    },
  )
  .on(
    // @ts-ignore
    connectChatWsEvent,
    ({ chat }, message: WsMessageType<IChat>) => {
      const { payload } = message;

      // move to watch or another method
      // setCookie(null, "chatToken", params.chatId, {
      //   maxAge: 30 * 24 * 60 * 60,
      //   path: "/",
      // });
      return {
        chat: payload,
        isLoaded: true,
        isFetching: false,
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
