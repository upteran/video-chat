import { createStore, sample } from "effector";
import { nanoid } from "nanoid";

import { wsService } from "../../../services/ws";
import { IWsMessage } from "../../../services/ws/types";
import { MessageT } from "../types";

import { connectChatWsEvent } from "../../chat/store/events";
import {
  updateMessagesListWsEvent,
  sendChatMessage,
  chatMsgReqBuilder,
} from "./events";

sendChatMessage.watch(({ message, chatId, userId }) => {
  wsService.send(
    // @ts-ignore
    chatMsgReqBuilder({ message, chatId, messageId: nanoid(), userId }),
  );
});

export const $messagesList = createStore<any>([]).on(
  updateMessagesListWsEvent,
  (list, result: IWsMessage<MessageT>) => {
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
