import { createStore, createEffect } from "effector";
import { nanoid } from "nanoid";

import { wsService } from "../../../services/ws";
import { WsMessageType } from "../../../services/ws/types";
import { MessageType } from "../types";

import { createMessage } from "./events";
import { updateMessagesListBridgeFx } from "./wsBridge";

export const sendUserMessageFx = createEffect((messageText: string) => {
  wsService.send(createMessage(messageText));
});

export const $messagesList = createStore([]).on(
  // @ts-ignore
  updateMessagesListBridgeFx.done,
  (list, { result }: { result: WsMessageType<MessageType> }) => {
    console.log("WORK", result);
    return result?.params ? [...list, result.params] : [];
  },
);

$messagesList.watch((messages) => {
  console.log("change watch", messages);
});
