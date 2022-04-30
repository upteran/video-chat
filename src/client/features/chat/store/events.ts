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

// TODO: rename type to some common name
export type connectChatEventType = {
  userName: string;
  chatId: string;
};

const { ev: connectChat, bridge: connectChatWsEvent } = createWsApi<
  connectChatEventType,
  WsMessageType<IChatConnected>
>("connectChat");

const { ev: removeFromChat, bridge: removeFromChatWsEvent } = createWsApi<
  connectChatEventType,
  WsMessageType<IChatConnected>
>("removeFromChat");

export {
  createChat,
  createChatWsEvent,
  connectChat,
  connectChatWsEvent,
  removeFromChat,
  removeFromChatWsEvent,
};
