export const buildCreateChatMsg = (chatId: string, users: Array<object>) => {
  return {
    method: "createChat",
    payload: {
      chatId,
      users,
    },
  };
};

export const buildConnectChatMsg = (chatId: string, user: any) => {
  return {
    method: "connectChat",
    payload: {
      chatId,
      user,
    },
  };
};
