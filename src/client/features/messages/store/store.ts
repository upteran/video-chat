import { createStore, sample } from "effector";
import { nanoid } from "nanoid";

import { IWsMessage } from "../../../services/ws/types";
import { Message } from "../types";

import { connectChatWsEvent } from "../../chat/store/events";
import {
  updateMessagesListWsEvent,
  sendChatMessage,
  chatMsgApi,
} from "./events";

sendChatMessage.watch(({ message, chatId, userId }) => {
  // @ts-ignore
  chatMsgApi({ message, chatId, messageId: nanoid(), userId });
});

export const $messagesList = createStore<any>([]).on(
  updateMessagesListWsEvent,
  (list, result: IWsMessage<Message>) => {
    return result?.payload ? [...list, result.payload] : [];
  },
);

sample({
  clock: connectChatWsEvent,
  target: $messagesList,
  fn: (msg) => {
    return msg.payload.messages;
  },
});

$messagesList.watch((messages) => {
  console.log("change watch", messages);
});
