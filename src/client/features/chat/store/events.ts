import { createWsApi } from "../../../services/ws";
import { WsMessageType } from "../../../services/ws/types";
import { IChat } from "../types";

export type createEventType = {
  userName: string;
};

const { ev: createChat, bridge: createChatWsEvent } = createWsApi<
  createEventType,
  WsMessageType<IChat>
>("createChat");

export type connectChatEventType = {
  userName: string;
  chatId: string;
};

const { ev: connectChat, bridge: connectChatWsEvent } = createWsApi<
  connectChatEventType,
  WsMessageType<IChat>
>("connectChat");

export { createChat, createChatWsEvent, connectChat, connectChatWsEvent };
