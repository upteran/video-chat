import { createWsApi } from "services/ws";
import { IWsMessage } from "services/ws/types";
import { Chat } from "entity/chat/types";
import { UserType } from "entity/user/types";

import { Message } from "../types";

type sendMsgType = {
  userId: UserType["userId"];
  message: Message["messageId"];
  chatId: Chat["chatId"];
};

const {
  ev: sendChatMessage,
  bridge: updateMessagesListWsEvent,
  apiSend: chatMsgApi,
} = createWsApi<sendMsgType, IWsMessage<Message>, IWsMessage<Message>>(
  "updateMessagesList",
);

export { sendChatMessage, updateMessagesListWsEvent, chatMsgApi };
