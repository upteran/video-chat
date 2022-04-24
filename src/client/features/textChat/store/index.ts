import { createEvent, createStore, Event, sample } from "effector";
import { parseCookies, setCookie } from "nookies";
import { nanoid } from "nanoid";

// ws
import { wsService } from "../../../services/ws";
import { WsMessageType } from "../../../services/ws/types";
import { buildCreateChatMsg, buildConnectChatMsg } from "./wsMessages";
import {
  createChatBridgeEvent,
  createChat,
  connectChat,
  connectChatBridgeEvent,
} from "./wsBridge";
import { $userStore } from "../../users/store";

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
    createChatBridgeEvent,
    ({ chat }, message: WsMessageType<IChat>) => {
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
  )
  .on(
    // @ts-ignore
    connectChatBridgeEvent,
    ({ chat }, message: WsMessageType<IChat>) => {
      const { params } = message;

      // move to watch or another method
      // setCookie(null, "chatToken", params.chatId, {
      //   maxAge: 30 * 24 * 60 * 60,
      //   path: "/",
      // });
      return {
        chat: params,
        isLoaded: true,
        isFetching: false,
      };
    },
  );

const createChatSample = sample({
  source: { chat: $chatStore, user: $userStore },
  clock: createChat,
});

createChatSample.watch(({ user }: any) => {
  const chatId = nanoid();
  const users = createUser(user.name, chatId);
  const msg = buildCreateChatMsg(chatId, [users]);
  wsService.send(msg);
});

connectChat.watch((chatId) => {
  const user = createUser("sadasdasds", chatId);
  const msg = buildConnectChatMsg(chatId, user);
  wsService.send(msg);
});
