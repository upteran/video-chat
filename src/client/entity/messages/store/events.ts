import { createWsApi } from "../../../services/ws";
import { IWsMessage } from "../../../services/ws/types";
import { Message } from "../types";
import { Chat } from "../../chat/types";
import { UserType } from "../../user/types";

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
