import { createWsApi } from "../../../services/ws";
import { WsMessageType } from "../../../services/ws/types";
import { MessageType } from "../types";

const { ev: sendChatMessage, bridge: updateMessagesListWsEvent } = createWsApi<
  string,
  WsMessageType<MessageType>
>("updateMessagesList");

export { sendChatMessage, updateMessagesListWsEvent };
