import { createEvent, createStore, Event } from "effector";
import { parseCookies, setCookie } from "nookies";

import { wsService } from "../../../services/ws";
import { createChatBridgeEvent } from "./wsBridge";
import { WsMessageType } from "../../../services/ws/types";
import { IChat } from "../types";
import { nanoid } from "nanoid";
import { createUser } from "../../users/helpers";
import { ChatStateType } from "../types";
import { buildChatMsg } from "./wsMessages";

const initialState = {
  chat: null,
  isLoaded: false,
  isFetching: false,
};

export const createChat = createEvent<object>("addChat");

createChat.watch(({ userName }: any) => {
  const chatId = nanoid();
  const users = createUser(userName, chatId);

  const msg = buildChatMsg(chatId, [users]);
  wsService.send(msg);
});

export const $chatStore = createStore<ChatStateType>(initialState).on(
  // @ts-ignore
  createChatBridgeEvent,
  ({ chat }, message: WsMessageType<IChat>) => {
    console.log("EVENT RET");
    const { params } = message;

    // move to watch or another method
    setCookie(null, "chatToken", params.chatId, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    return {
      chat: params,
      isLoaded: true,
      isFetching: false,
    };
  },
);
