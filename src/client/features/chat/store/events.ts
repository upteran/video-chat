import { createWsApi } from "../../../services/ws";
import { IWsMessage } from "../../../services/ws/types";
import { IChat, IChatConnected } from "../types";
import { UserType } from "../../user/types";

export type createChatET = {
  userName: string;
};

type createChatPayloadT = {
  chatId: string;
  users: Array<UserType>;
};

const {
  ev: createChat,
  bridge: createChatWsEvent,
  wsMsgBuilder: createChatReqBuilder,
} = createWsApi<createChatET, IWsMessage<IChat>, createChatPayloadT>(
  "createChat",
);

export type userChatET = {
  userName: string;
  chatId: string;
};

export type userChatAddET = {
  user: UserType;
  chatId: string;
};

const {
  ev: connectChat,
  bridge: connectChatWsEvent,
  wsMsgBuilder: connectChatWsBuilder,
} = createWsApi<userChatET, IWsMessage<IChatConnected>, userChatAddET>(
  "connectChat",
);

const {
  ev: removeFromChat,
  bridge: removeFromChatWsEvent,
  wsMsgBuilder: removeChatWsBuilder,
} = createWsApi<userChatET, IWsMessage<IChatConnected>, userChatET>(
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
  createChatReqBuilder,
  connectChat,
  connectChatWsEvent,
  connectChatWsBuilder,
  removeFromChat,
  removeFromChatWsEvent,
  removeChatWsBuilder,
  closeChatWsEvent,
};
