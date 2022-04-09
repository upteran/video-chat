import { createStore, createEffect } from "effector";
import { nanoid } from "nanoid";

import { wsService } from "../../../services/ws";
import { WsMessageType } from "../../../services/ws/types";
import { MessageType } from "../types";

const namespace = "message";

const createMessage = (msg: string): WsMessageType<MessageType> => ({
  id: nanoid(),
  namespace,
  method: "sendMessage",
  params: {
    text: msg,
    chatId: nanoid(),
    messageId: nanoid(),
  },
});

export const sendUserMessageFx = createEffect((messageText: string) => {
  wsService.send(createMessage(messageText));
});

const updateMessagesListFx = createEffect();

updateMessagesListFx.use((data: any) => {
  return data;
});

// store fn
wsService.subscribeStore({ name: namespace, cb: updateMessagesListFx });

export const $messagesList = createStore([])
  .on(sendUserMessageFx.done, (_, messages) => {
    console.log("msg", messages);
  })
  .on(
    // @ts-ignore
    updateMessagesListFx.done,
    (list, { result }: { result: WsMessageType<MessageType> }) => {
      console.log("WORK", result);
      return result?.params ? [...list, result.params] : [];
    },
  );

$messagesList.watch((messages) => {
  console.log("change watch", messages);
});
