import { WsMessageType } from "../../../services/ws/types";
import { MessageType } from "../types";
import { nanoid } from "nanoid";

export const namespace = "message";

export const createMessage = (
  msg: string,
  chatId: string,
): WsMessageType<MessageType> => ({
  id: nanoid(),
  namespace,
  method: "sendMessage",
  params: {
    text: msg,
    chatId,
    messageId: nanoid(),
  },
});
