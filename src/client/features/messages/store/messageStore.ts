import { createStore, createEvent } from "effector";

import { wsService } from "../../../services/ws";
import { WsMessageType } from "../../../services/ws/types";
import { MessageType } from "../types";

import { createMessage } from "./events";
import { updateMessagesListBridgeEvent } from "./wsBridge";

export const sendChatMessage = createEvent<string>("sendChatMessage");

sendChatMessage.watch((messageText: string) => {
  wsService.send(createMessage(messageText, "asdasd"));
});

export const $messagesList = createStore([]).on(
  // @ts-ignore
  updateMessagesListBridgeEvent,
  (list, result: WsMessageType<MessageType>) => {
    console.log("WORK", result);
    return result?.params ? [...list, result.params] : [];
  },
);

$messagesList.watch((messages) => {
  console.log("change watch", messages);
});
