import { WsMessageType } from "../../../services/ws/types";
import { MessageType } from "../types";
import { nanoid } from "nanoid";

export const createMessage = (
  msg: string,
  chatId: string,
): WsMessageType<MessageType> => ({
  id: nanoid(),
  method: "updateMessagesList",
  payload: {
    text: msg,
    chatId,
    messageId: nanoid(),
  },
});
