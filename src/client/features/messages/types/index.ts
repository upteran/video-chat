export type Message = {
  userId: string;
  messageId: string;
  message: string;
  chatId: string;
};

export type MessagesList = Array<Message>;
