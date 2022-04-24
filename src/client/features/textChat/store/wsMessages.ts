import { namespace } from "./wsBridge";

export const buildCreateChatMsg = (chatId: string, users: Array<object>) => {
  return {
    namespace,
    method: "createChat",
    params: {
      chatId,
      users,
    },
  };
};

export const buildConnectChatMsg = (chatId: string, user: any) => {
  return {
    namespace,
    method: "connectChat",
    params: {
      chatId,
      user,
    },
  };
};
