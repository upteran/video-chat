import { createStore } from "effector";

import { wsService } from "../../../services/ws";
import { WsMessageType } from "../../../services/ws/types";
import { MessageType } from "../types";

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

$messagesList.watch((messages) => {
  console.log("change watch", messages);
});
