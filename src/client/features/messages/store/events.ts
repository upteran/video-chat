import { createWsApi } from "../../../services/ws";
import { WsMessageType } from "../../../services/ws/types";
import { MessageType } from "../types";

type sendMsgType = {
  msg: string;
  chatId: string;
};

const { ev: sendChatMessage, bridge: updateMessagesListWsEvent } = createWsApi<
  sendMsgType,
  WsMessageType<MessageType>
>("updateMessagesList");

export { sendChatMessage, updateMessagesListWsEvent };
