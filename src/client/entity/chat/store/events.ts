import { createWsApi } from "services/ws";
import { IWsMessage } from "services/ws/types";
import {
  Chat,
  ChatConnected,
  CreateChatEv,
  CreateChatPayload,
  UserChatAdd,
  UserChatEv,
} from "../types";

const {
  ev: createChat,
  bridge: createChatWsEvent,
  apiSend: createChatApi,
} = createWsApi<CreateChatEv, IWsMessage<Chat>, CreateChatPayload>(
  "createChat",
);

const {
  ev: connectChat,
  bridge: connectChatWsEvent,
  apiSend: connectChatApi,
} = createWsApi<UserChatEv, IWsMessage<ChatConnected>, UserChatAdd>(
  "connectChat",
);

const {
  ev: removeFromChat,
  bridge: removeFromChatWsEvent,
  apiSend: removeChatApi,
} = createWsApi<UserChatEv, IWsMessage<ChatConnected>, UserChatEv>(
  "removeFromChat",
);

const { bridge: closeChatWsEvent } = createWsApi<
  undefined,
  undefined,
  undefined
>("closeChat");

export {
  createChat,
  createChatWsEvent,
  createChatApi,
  connectChat,
  connectChatWsEvent,
  connectChatApi,
  removeFromChat,
  removeFromChatWsEvent,
  removeChatApi,
  closeChatWsEvent,
};
