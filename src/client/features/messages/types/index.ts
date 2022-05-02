export type MessageT = {
  userId: string;
  messageId: string;
  message: string;
  chatId: string;
};

export type MessagesList = Array<MessageT>;
