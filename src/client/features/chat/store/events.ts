import { createWsApi } from "../../../services/ws";
import { WsMessageType } from "../../../services/ws/types";
import { IChat, IChatConnected } from "../types";

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
  WsMessageType<IChatConnected>
>("connectChat");

export { createChat, createChatWsEvent, connectChat, connectChatWsEvent };
