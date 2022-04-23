import { nanoid } from "nanoid";
import { namespace } from "./wsBridge";

export const buildChatMsg = (chatId: string, users: Array<object>) => {
  return {
    id: nanoid(),
    namespace,
    method: "createChat",
    params: {
      chatId,
      users,
    },
  };
};
