import { createStore, createEvent } from "effector";

import { wsService } from "../../../services/ws";
import { WsMessageType } from "../../../services/ws/types";
import { MessageType } from "../types";

import { createMessage } from "./events";
import { updateMessagesListWsEvent, sendChatMessage } from "./wsApi";

sendChatMessage.watch((messageText: string) => {
  wsService.send(createMessage(messageText, "asdasd"));
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
