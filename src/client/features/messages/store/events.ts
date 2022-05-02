import { createWsApi } from "../../../services/ws";
import { IWsMessage } from "../../../services/ws/types";
import { MessageT } from "../types";

type sendMsgType = {
  userId: string;
  message: string;
  chatId: string;
};

const {
  ev: sendChatMessage,
  bridge: updateMessagesListWsEvent,
  wsMsgBuilder: chatMsgReqBuilder,
} = createWsApi<sendMsgType, IWsMessage<MessageT>, IWsMessage<MessageT>>(
  "updateMessagesList",
);

export { sendChatMessage, updateMessagesListWsEvent, chatMsgReqBuilder };
