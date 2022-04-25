import { createStore, sample } from "effector";

import { wsService } from "../../../services/ws";
import { WsMessageType } from "../../../services/ws/types";
import { MessageType } from "../types";

import { connectChatWsEvent } from "../../chat/store/events";
import { createMessage } from "./wsMessageBuilders";
import { updateMessagesListWsEvent, sendChatMessage } from "./events";

sendChatMessage.watch(({ msg, chatId }) => {
  wsService.send(createMessage(msg, chatId));
});

export const $messagesList = createStore<any>([]).on(
  updateMessagesListWsEvent,
  (list, result: WsMessageType<MessageType>) => {
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
